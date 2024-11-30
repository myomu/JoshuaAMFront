import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as attendanceApi from "../../apis/attendanceApi";
import * as Swal from "../../apis/alert";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import "./AttendanceList.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";
dayjs.extend(utc);

const AttendanceList = () => {
  const navigate = useNavigate();

  const [attendanceIds, setAttendanceIds] = useState([]);

  const handleSelectAttendance = (selectAttendance) => {
    const selectedData = selectAttendance
      .map((id) => rows.find((row) => row.id === id))
      .filter(Boolean);
    const selectAttendanceIds = selectedData.map((row) => row.attendanceId);
    setAttendanceIds(selectAttendanceIds);
  };

  const columns = [
    {
      field: "attendanceDate",
      headerAlign: "center",
      headerName: "날짜",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div className="tableItem">
          {(params = dayjs.utc(params.value).local().format("YYYY-MM-DD"))}
        </div>
      ),
    },
    {
      field: "attendanceDataDtoList",
      headerAlign: "center",
      headerName: "출석인원",
      minWidth: 400,
      flex: 3,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              marginTop: "7px",
              marginBottom: "7px",
            }}
          >
            {params.value.map((member, index) => (
              <Box
                key={index}
                style={{
                  display: "inline-block",
                  marginRight: "10px",
                  minWidth: "38px",
                }}
              >
                {member.memberName}
              </Box>
            ))}
          </Box>
        );
      },
    },
    {
      field: "totalMember",
      headerAlign: "center",
      headerName: "출석수",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => <div className="tableItem">{params.value}</div>,
    },
    {
      field: "edit",
      headerAlign: "center",
      headerName: "수정",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="tableItem">
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate(`edit/${params.row.attendanceId}`)}
            style={{ fontFamily: "GangwonEdu_OTFBoldA" }}
          >
            수정
          </Button>
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0); // 총 데이터 개수
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const [sortModel, setSortModel] = useState([
    { field: 'attendanceDate', sort: 'desc'}
  ]);

  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);
  };


  // 출석 목록 요청
  const getAttendances = async (paginationModel, sortField, sortDirection) => {
    try {
      const response = await attendanceApi.getAttendances(paginationModel.page, paginationModel.pageSize, sortField, sortDirection);
      const attendances = response.data.content;
      setRows(
        attendances &&
          attendances.map((data, idx) => {
            return {
              id: idx,
              ...data,
            };
          })
      );
      setRowCount(response.data.totalElements);
    } catch (error) {
      console.error(`출석 목록을 불러오는데 실패했습니다.`);
      console.error(`${error}`);
    }
  };

  // 출석 삭제
  const deleteAttendance = async (attendanceIds) => {
    try {
      await attendanceApi.deleteAttendance({ attendanceIds });
      alert("출석 삭제 성공");
      window.location.replace("/attendances");
    } catch (error) {
      console.error(`출석 삭제에 실패하였습니다.`);
      console.error(`${error}`);
      alert("출석 삭제 실패");
    }
  };

  useEffect(() => {
    getAttendances(paginationModel, sortModel[0]?.field, sortModel[0]?.sort);
  }, [paginationModel, sortModel]);

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => "auto"} // row 안의 data가 다음 줄로 가도록 높이 사이즈를 자동으로 조절해줌.
        checkboxSelection
        onRowSelectionModelChange={(selection) => {
          handleSelectAttendance(selection);
        }}
        disableColumnMenu
        slots={{
          toolbar: () => (
            <CustomToolbar
              attendanceIds={attendanceIds}
              deleteAttendance={deleteAttendance}
            />
          ),
        }}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
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

export default AttendanceList;

const CustomToolbar = ({ attendanceIds, deleteAttendance }) => {
  const navigate = useNavigate();

  return (
    <GridToolbarContainer>
      <Button onClick={() => navigate("/attendanceCheck")}>
        <AddOutlined />
        출석추가
      </Button>
      <Button
        onClick={() => {
          Swal.confirm(
            "출석 삭제",
            "출석을 삭제하시겠습니까?",
            "warning",
            (result) => {
              if (result.isConfirmed) {
                deleteAttendance(attendanceIds);
              }
            }
          );
        }}
        disabled={attendanceIds.length === 0}
      >
        <RemoveOutlined />
        출석삭제
      </Button>
    </GridToolbarContainer>
  );
};
