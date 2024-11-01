import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import * as memberApi from "../../apis/memberApi";
import * as Swal from "../../apis/alert";
import "./MemberList.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  AddOutlined,
  FileDownload,
  RemoveOutlined,
  SaveAltOutlined,
  SaveAltRounded,
  SaveAltSharp,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
dayjs.extend(utc);

const MemberList = () => {
  const navigate = useNavigate();

  const [memberIds, setMemberIds] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDate = (value) => {
    setStartDate(value);
  };
  const handleEndDate = (value) => {
    setEndDate(value);
  };

  const handleSelectMember = (selectMember) => {
    const selectedData = selectMember
      .map((id) => rows.find((row) => row.id === id))
      .filter(Boolean);
    const selectMemberIds = selectedData.map((row) => row.memberId);
    setMemberIds(selectMemberIds);
  };

  const cancelDatePicker = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const columns = [
    {
      field: "name",
      headerAlign: "center",
      headerName: "이름",
      minWidth: 80,
      flex: 1,
      renderCell: (params) => <div className="tableItem">{params.value}</div>,
    },
    {
      field: "birthdate",
      headerAlign: "center",
      headerName: "생년월일",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => <div className="tableItem">{params.value}</div>,
    },
    {
      field: "gender",
      headerName: "성별",
      headerAlign: "center",
      minWidth: 70,
      flex: 1,
      renderCell: (params) => (
        <div className="tableItem">
          {(params = params.value === "MAN" ? "남자" : "여자")}
        </div>
      ),
    },
    {
      field: "groupName",
      headerName: "그룹",
      headerAlign: "center",
      minWidth: 80,
      flex: 1,
      renderCell: (params) => <div className="tableItem">{params.value}</div>,
    },
    // {
    //   field: "memberStatus",
    //   headerName: "구분",
    //   renderCell: (params) =>
    //     (params = params.value === "MEMBER" ? "회원" : "비회원"),
    // },
    {
      field: "attendanceRate",
      headerName: "출석률",
      headerAlign: "center",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <div style={{ position: "relative", marginTop: 18 }}>
          <ProgressBar
            now={params.value}
            striped={true}
            style={{ backgroundColor: "#c8c8c8" }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {`${params.value}%`}
          </div>
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "수정",
      headerAlign: "center",
      flex: 2,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="tableItem">
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate(`edit/${params.row.memberId}`)}
            style={{ fontFamily: "GangwonEdu_OTFBoldA" }}
          >
            수정
          </Button>
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState([]);

  // 회원 목록 요청
  const getMembers = async (date) => {
    try {
      const response = await memberApi.getMembers(date);
      const members = response.data;

      setRows(
        members &&
          members.map((data, idx) => {
            const newData = {
              ...data,
              birthdate: dayjs.utc(data.birthdate).local().format("YYYY.MM.DD"),
            };
            return {
              id: idx,
              ...newData,
            };
          })
      );
    } catch (error) {
      console.error(`회원 목록을 불러오는데 실패했습니다.`);
      console.error(`${error}`);
    }
  };

  // 회원 삭제
  const deleteMember = async (memberIds) => {
    try {
      await memberApi.deleteMember({ memberIds });
      alert("회원 삭제 성공");
      window.location.replace("/members");
    } catch (error) {
      console.error(`회원 삭제에 실패하였습니다.`);
      console.error(`${error}`);
      alert("회원 삭제 실패");
    }
  };

  useEffect(() => {
    const date = {
      startDate:
        startDate != null ? dayjs(startDate).format("YYYY-MM-DDTHH:mm") : null,
      endDate:
        endDate != null ? dayjs(endDate).format("YYYY-MM-DDTHH:mm") : null,
    };

    getMembers(date);
  }, [startDate, endDate]);

  return (
    <>
      <div className="datePicker">
        <DesktopDatePicker
          className="mb-2 me-3"
          label="시작일"
          format="YYYY / MM / DD"
          slotProps={{ textField: { size: "small" } }}
          value={startDate}
          onChange={(newValue) => {
            handleStartDate(newValue);
          }}
        />
        <DesktopDatePicker
          className="mb-2 me-3"
          label="종료일"
          format="YYYY / MM / DD"
          slotProps={{ textField: { size: "small" } }}
          value={endDate}
          onChange={(newValue) => {
            handleEndDate(newValue);
          }}
        />
        <Button
          className="btn__datepicker__cancel mb-2"
          variant="contained"
          onClick={cancelDatePicker}
          style={{ fontFamily: "GangwonEdu_OTFBoldA" }}
        >
          취소
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(selection) => {
          handleSelectMember(selection);
        }}
        disableColumnMenu
        slots={{
          toolbar: () => (
            <CustomToolbar
              memberIds={memberIds}
              deleteMember={deleteMember}
              rows={rows}
              columns={columns}
            />
          ),
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        autoHeight
        sx={{
          "& .MuiDataGrid-cellCheckbox:focus-within": { outline: "none" },
          "& .MuiDataGrid-cell:focus": { outline: "none" },
          "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
          "& .MuiDataGrid-columnHeader:focus-within": {
            outline: "none", // 헤더 셀 내부 포커스 아웃라인을 제거합니다.
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "16px", // 헤더 폰트 크기
            fontFamily: "GangwonEdu_OTFBoldA, Arial, sans-serif", // 헤더 폰트
            fontWeight: "bold", // 헤더 폰트 굵기
          },
          "& .MuiDataGrid-cell": {
            fontSize: "14px", // 데이터 셀 폰트 크기
            fontFamily: "GangwonEdu_OTFBoldA, Arial, sans-serif", // 데이터 셀 폰트
          },
        }}
      />
      <br></br>
    </>
  );
};

export default MemberList;

const CustomToolbar = ({ memberIds, deleteMember, rows, columns }) => {
  const navigate = useNavigate();

  const handleExport = () => {
    // 선택된 행마 ㄴ내보내기
    const exportRows = memberIds.length
      ? rows.filter((row) => memberIds.includes(row.memberId))
      : rows;

    const exportData = exportRows.map((row) =>
      columns.reduce((acc, column) => {
        acc[column.headerName] = row[column.field];
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "회원_목록.xlsx");
  };

  return (
    <GridToolbarContainer>
      {/* <GridToolbarExport /> */}
      <Button onClick={handleExport}>
        <SaveAltOutlined style={{ marginRight: "3px", fontSize: "1.2rem"}}/>
        내보내기
      </Button>
      <Button onClick={() => navigate("create")}>
        <AddOutlined />
        회원추가
      </Button>
      <Button
        onClick={() => {
          Swal.confirm(
            "회원 삭제",
            "회원을 삭제하시겠습니까?",
            "warning",
            (result) => {
              if (result.isConfirmed) {
                deleteMember(memberIds);
              }
            }
          );
        }}
        disabled={memberIds.length === 0}
      >
        <RemoveOutlined />
        회원삭제
      </Button>
    </GridToolbarContainer>
  );
};
