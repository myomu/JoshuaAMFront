import { Button } from "@mui/material";
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

  // const [attendances, setAttendances] = useState("");
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
        params = dayjs.utc(params.value).local().format("YYYY-MM-DD")
      )
     },
    { field: "attendanceDataDtoList", headerName: "출석인원", width: "500",
      renderCell: (params) => {
        // const names = params.value.map((member) => member.memberName).join("     ");
        // return <span>{names}</span>
        return (
          <div>
            {params.value.map((member, index) => (
              <div key={index} style={{ display: "inline-block", marginRight: "10px"}}>
                {member.memberName}
              </div>
            ))}
          </div>
        )
      }
      
     },
    { field: "totalMember", headerName: "총인원" },
    {
      field: "edit",
      headerName: "수정",
      renderCell: (params) => (
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate(`edit/${params.row.attendanceId}`)}
        >
          수정
        </Button>
      ),
    },
  ];

  const [rows, setRows] = useState([]);

  // 출석 목록 요청
  const getAttendances = async () => {
    try {
      const response = await attendanceApi.getAttendances();
      const attendances = response.data;
      console.log(attendances);
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

  const handleSubmit = (e) => {
    e.preventDefault(); //페이지 리로드 방지.
    console.log(attendanceIds);
    // memberIds.sort();

    // const formData = {
    //   attendanceIds: attendanceIds,
    // };

    //   api
    //     .post(`/attendances`, formData, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       }
    //     })
    //     .then((response) => {
    //       console.log(response);
    //       alert("출석 삭제에 성공하였습니다.");
    //       window.location.replace("/attendances");
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //       alert("출석 삭제에 실패하였습니다.");
    //     });
  };

  return (
    // <tbody style={{ fontSize: "14px" }}>
    //   {attendances
    //     ? attendances.map((a, i) => {
    //         const date = new Date(a.attendanceDate);
    //         const year = date.getFullYear();
    //         const month = String(date.getMonth() + 1).padStart(2, "0");
    //         const day = String(date.getDate()).padStart(2, "0");

    //         const formattedDate = `${year}-${month}-${day}`;

    //         return (
    //           // <tr key={i} className="text-center align-middle">
    //           //   <td>
    //           //     <Checkbox value={a.attendanceId}></Checkbox>
    //           //   </td>
    //           //   <td>{formattedDate}</td>
    //           //   <td>
    //           //     <Row xs="auto">
    //           //       {a.attendanceDataDtoList.map((b, j) => (
    //           //         <Col key={j}>
    //           //           <div>{b.memberName}</div>
    //           //         </Col>
    //           //       ))}
    //           //     </Row>
    //           //   </td>
    //           //   <td>{a.totalMember}</td>
    //           //   <td>
    //           //     <Button
    //           //       variant="light"
    //           //       onClick={() => {
    //           //         navigate("edit/" + a.attendanceId);
    //           //       }}
    //           //     >
    //           //       <i className="fa-regular fa-pen-to-square"></i>
    //           //     </Button>
    //           //   </td>
    //           // </tr>

    //         );
    //       })
    //     : null}
    // </tbody>

    <>
      <div>
        <DataGrid
          rows={rows}
          columns={columns}
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
