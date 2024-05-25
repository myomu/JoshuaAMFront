import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Button } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import * as memberApi from "../../apis/memberApi";
import * as Swal from "../../apis/alert";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const MemberList = () => {
  const navigate = useNavigate();

  // const [members, setMembers] = useState("");
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
    console.log("selectMemberIds: ", selectMemberIds);
    setMemberIds(selectMemberIds);

  };

  const columns = [
    { field: "name", headerName: "이름" },
    { field: "birthdate", headerName: "생년월일" },
    {
      field: "gender",
      headerName: "성별",
      renderCell: (params) =>
        (params = params.value === "MAN" ? "남자" : "여자"),
    },
    { field: "groupName", headerName: "그룹" },
    {
      field: "memberStatus",
      headerName: "구분",
      renderCell: (params) =>
        (params = params.value === "MEMBER" ? "회원" : "비회원"),
    },
    {
      field: "attendanceRate",
      headerName: "출석률",
      // width: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ position: "relative", marginTop: 18 }}>
          <ProgressBar now={params.value} />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              fontWeight: "bold",
            }}
          >
            {/* {`${Math.round(params.value)}%`} */}
            {`${params.value}%`}
          </div>
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "수정",
      renderCell: (params) => (
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate(`edit/${params.row.memberId}`)}
        >
          수정
        </Button>
      ),
    },
  ];

  const [rows, setRows] = useState([]);

  // 회원 목록 요청
  const getMembers = async (date) => {
    try {
      const response = await memberApi.getMembers(date);
      //setMembers(response.data);
      const members = response.data;
      // setRows(
      //   members &&
      //     members.map((data, idx) => ({
      //       id: idx,
      //       ...data,
      //     }))
      // );
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
      // console.log(members);
    } catch (error) {
      console.error(`회원 목록을 불러오는데 실패했습니다.`);
      console.error(`${error}`);
    }
  };

  // 회원 삭제
  const deleteMember = async (memberIds) => {
    try {
      await memberApi.deleteMember({ memberIds });
      // alert("회원 삭제에 성공하였습니다.");
      // window.location.replace("/members");
      Swal.alert("회원 삭제 성공", "", "success", () => {
        window.location.replace("/members");
      });
    } catch (error) {
      console.error(`회원 삭제에 실패하였습니다.`);
      console.error(`${error}`);
      // alert("회원 삭제에 실패하였습니다.");
      Swal.alert("회원 삭제 실패", "", "error");
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

  // const handleDatePicker = () => {
  //   const date = {
  //     startDate:
  //       startDate != null ? dayjs(startDate).format("YYYY-MM-DDTHH:mm") : null,
  //     endDate:
  //       endDate != null ? dayjs(endDate).format("YYYY-MM-DDTHH:mm") : null,
  //   };
  //   getMembers(date);
  // }

  return (
    <>
      <div>
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
          className="mb-2"
          label="종료일"
          format="YYYY / MM / DD"
          slotProps={{ textField: { size: "small" } }}
          value={endDate}
          onChange={(newValue) => {
            handleEndDate(newValue);
          }}
        />
        {/* <Button className="btnDatePicker" variant="outlined" onClick={() => {
          handleDatePicker();
        }}>확인</Button> */}
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(selection) => {
          handleSelectMember(selection);
        }}
        disableColumnMenu
        // slotProps={{
        //   toolbar: { csvOptions: { fields: ["name", "birthdate", "gender", "groupName", "memberStatus", "attendanceRate"]}}
        // }}
        slots={{
          toolbar: () => (
            <CustomToolbar memberIds={memberIds} deleteMember={deleteMember} />
          ),
        }}
      />
      <br></br>
      {/* <EnhancedTable></EnhancedTable> */}
    </>
  );
};

export default MemberList;

const CustomToolbar = ({ memberIds, deleteMember }) => {
  const navigate = useNavigate();

  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <Button onClick={() => navigate("create")}>회원추가</Button>
      <Button onClick={() => {
        Swal.confirm(
          "회원을 삭제하시겠습니까?",
          "",
          "warning",
          (result) => {
            if (result.isConfirmed) {
              deleteMember(memberIds);
            }
          }
        )
      }} disabled={memberIds.length === 0}>회원삭제</Button>
    </GridToolbarContainer>
  );
};
