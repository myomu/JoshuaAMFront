import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as attendanceApi from "../../apis/attendanceApi";
import * as Swal from "../../apis/alert";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const AttendanceList = () => {
  const navigate = useNavigate();

  const [attendanceIds, setAttendanceIds] = useState([]);

  const handleSelectAttendance = (selectAttendance) => {
    const selectedData = selectAttendance
      .map((id) => rows.find((row) => row.id === id))
      .filter(Boolean);
    const selectAttendanceIds = selectedData.map((row) => row.attendanceId);
    console.log("selectAttendanceIds: ", selectAttendanceIds);
    setAttendanceIds(selectAttendanceIds);
  };

  const columns = [
    { field: "attendanceDate", headerName: "날짜", width: "200",
      renderCell: (params) => (
        <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
          {params = dayjs.utc(params.value).local().format("YYYY-MM-DD")}
        </div>
      ),
      headerAlign: "center",
     },
    { field: "attendanceDataDtoList", headerName: "출석인원", width: "500",
      headerAlign: "center",
      renderCell: (params) => {
        // const names = params.value.map((member) => member.memberName).join("     ");
        // return <span>{names}</span>
        return (
          <Box sx={{
            marginTop: "7px",
            marginBottom: "7px",
          }}
            // sx={{
            //   whiteSpace: 'normal',
            //   wordWrap: 'break-word',
            //   display: 'flex',
            //   flexDirection: 'column',
            //   maxHeight: '150px',
            //   overflow: 'auto',
            // }}
          >
            {params.value.map((member, index) => (
              <Box key={index} style={{ display: "inline-block", marginRight: "10px", minWidth: "38px"}}>
                {member.memberName}
              </Box>
            ))}
          </Box>
        )
      }
      
     },
    { field: "totalMember", headerName: "총인원",
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
          {params.value}
        </div>
      )
     },
    {
      field: "edit",
      headerName: "수정",
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(`edit/${params.row.attendanceId}`)}
          >
            수정
          </Button>
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState([]);

  // 출석 목록 요청
  const getAttendances = async () => {
    try {
      const response = await attendanceApi.getAttendances();
      const attendances = response.data;
      // console.log(attendances);
      setRows(
        attendances &&
          attendances.map((data, idx) => {
            return {
              id: idx,
              ...data,
            };
          })
      );
    } catch (error) {
      console.error(`출석 목록을 불러오는데 실패했습니다.`);
      console.error(`${error}`);
    }
  };

  // 출석 삭제
  const deleteAttendance = async (attendanceIds) => {
    try {
      await attendanceApi.deleteAttendance({ attendanceIds });
      // alert("회원 삭제에 성공하였습니다.");
      // window.location.replace("/members");
      Swal.alert("출석 삭제 성공", "", "success", () => {
        window.location.replace("/attendances");
      });
    } catch (error) {
      console.error(`출석 삭제에 실패하였습니다.`);
      console.error(`${error}`);
      // alert("회원 삭제에 실패하였습니다.");
      Swal.alert("출석 삭제 실패", "", "error");
    }
  };

  useEffect(() => {
    // api
    //   .get(`/attendances`)
    //   .then((response) => {
    //     setAttendances(response.data);
    //     console.log(response.data);
    //   })
    //   .catch((error) => console.log(error));
    getAttendances();
  }, []);

  return (
    <>
      <div>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowHeight={() => "auto"}
          checkboxSelection
          onRowSelectionModelChange={(selection) => {
            handleSelectAttendance(selection);
          }}
          disableColumnMenu
          // slotProps={{
          //   toolbar: { csvOptions: { fields: ["name", "birthdate", "gender", "groupName", "memberStatus", "attendanceRate"]}}
          // }}
          slots={{
            toolbar: () => (
              <CustomToolbar
                attendanceIds={attendanceIds}
                deleteAttendance={deleteAttendance}
              />
            ),
          }}
        />
      </div>
    </>
  );
};

export default AttendanceList;

const CustomToolbar = ({ attendanceIds, deleteAttendance }) => {
  const navigate = useNavigate();

  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <Button onClick={() => navigate("/attendanceCheck")}>출석추가</Button>
      <Button
        onClick={() => {
          Swal.confirm("출석을 삭제하시겠습니까?", "", "warning", (result) => {
            if (result.isConfirmed) {
              deleteAttendance(attendanceIds);
            }
          });
        }}
        disabled={attendanceIds.length === 0}
      >
        출석삭제
      </Button>
    </GridToolbarContainer>
  );
};
