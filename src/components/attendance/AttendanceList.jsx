import { Box, Button, LinearProgress } from "@mui/material";
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
    console.log("selectAttendanceIds: ", selectAttendanceIds);
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
        // const names = params.value.map((member) => member.memberName).join("     ");
        // return <span>{names}</span>
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
      renderCell: (params) => (
        <div className="tableItem">
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate(`edit/${params.row.attendanceId}`)}
            style={{ fontFamily: 'GangwonEdu_OTFBoldA' }}
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
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => "auto"} // row 안의 data가 다음 줄로 가도록 높이 사이즈를 자동으로 조절해줌.
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
          "& .MuiDataGrid-cellCheckbox:focus-within": {outline: "none"},
          "& .MuiDataGrid-cell:focus": { outline: "none" },
          "& .MuiDataGrid-columnHeader:focus": { outline: "none" },
          "& .MuiDataGrid-columnHeader:focus-within": {
            outline: "none", // 헤더 셀 내부 포커스 아웃라인을 제거합니다.
          },
        }}
        pagination
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
