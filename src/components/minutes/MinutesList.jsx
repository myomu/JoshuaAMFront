import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import * as Swal from "../../apis/alert";
import { useNavigate } from 'react-router-dom';
import * as minutesApi from "../../apis/minutesApi";
import dayjs from 'dayjs';

const MinutesList = () => {

  const [minutesIds, setMinutesIds] = useState([]);

  const navigate = useNavigate();

  const handleCellClick = (params) => {
    if (params.field === 'title') { // 틀정 column 을 클릭했을 때만 이동함
      navigate(`detail/${params.row.meetingMinutesId}`);
    }
  }

  const columns = [
    {
      field: "meetingMinutesId",
      headerAlign: "center",
      headerName: "번호",
      minWidth: 80,
      flex: 0.5,
      renderCell: (params) => <div className="tableItem">{params.value}</div>,
    },
    {
      field: "title",
      headerAlign: "center",
      headerName: "제목",
      minWidth: 200,
      flex: 5,
      renderCell: (params) => <div style={{cursor: "pointer"}} className="tableItem">{params.value}</div>,
    },
    {
      field: "author",
      headerAlign: "center",
      headerName: "작성자",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => <div className="tableItem">{params.value}</div>,
    },
    {
      field: "createdAt",
      headerAlign: "center",
      headerName: "작성일",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => <div className="tableItem">{(params = dayjs.utc(params.value).local().format("YYYY-MM-DD HH:mm"))}</div>,
    },
    {
      field: "updatedAt",
      headerAlign: "center",
      headerName: "수정일",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => <div className="tableItem">{(params = dayjs.utc(params.value).local().format("YYYY-MM-DD HH:mm"))}</div>,
    },
  ]

  const [rows, setRows] = useState([]);

  const handleSelectMinutes = (selectMinutes) => {
    const selectedData = selectMinutes
      .map((id) => rows.find((row) => row.id === id))
      .filter(Boolean);
    const selectMinutesIds = selectedData.map((row) => row.meetingMinutesId);
    console.log("selectMemberIds: ", selectMinutesIds);
    setMinutesIds(selectMinutesIds);
  };

  // 회의록 목록 요청
  const getAllMinutes = async () => {
    try {
      const response = await minutesApi.getAllOfMinutes();
      const minutes = response.data;
      console.log(minutes);
      setRows(
        minutes &&
          minutes.map((data, idx) => {
            return {
              id: idx,
              ...data,
            }
          })
      )
    } catch (error) {
      console.error(`${error}`);
    }
  }

  // 회의록 삭제 요청
  const deleteMinutes = async (minutesIds) => {
    try {
      await minutesApi.deleteMinutes({ meetingMinutesIds : minutesIds });
      Swal.alert("회의록 삭제 성공", "", "success", () => {
        window.location.replace("/minutes");
      });
    } catch (error) {
      console.error(`회의록 삭제에 실패하였습니다: ${error}`);
      alert("회의록 삭제 실패", "", "error");
    }
  };

  useEffect(() => {
    getAllMinutes();
  }, []);

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick // 이 옵션은 테이블의 row 를 클릭해도 checkbox 가 클릭되지 않게 해준다.
        onCellClick={handleCellClick} // 이 옵션으로 인해 특정 field 를 클릭하는 이벤트를 실행할 수 있다.
        onRowSelectionModelChange={(selection) => {
          handleSelectMinutes(selection);
        }}
        disableColumnMenu
        slots={{
          toolbar: () => (
            <CustomToolbar minutesIds={minutesIds} deleteMinutes={deleteMinutes} />
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
      />
      <br></br>
    </>
  )
}

export default MinutesList

const CustomToolbar = ({ minutesIds, deleteMinutes }) => {
  const navigate = useNavigate();

  return (
    <GridToolbarContainer>
      {/* <GridToolbarExport /> */}
      <Button onClick={() => navigate("create")}>
        <AddOutlined />
        추가
      </Button>
      <Button
        onClick={() => {
          Swal.confirm("회의록 삭제", "회의록을 삭제하시겠습니까?", "warning", (result) => {
            if (result.isConfirmed) {
              deleteMinutes(minutesIds);
            }
          });
        }}
        disabled={minutesIds.length === 0}
      >
        <RemoveOutlined />
        삭제
      </Button>
    </GridToolbarContainer>
  );
};