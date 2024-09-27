import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataGrid,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import * as Swal from "../../apis/alert";
import * as groupApi from "../../apis/groupApi";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";

function Groups() {
  let navigate = useNavigate();

  // const [groups, setGroups] = useState("");
  const [groupIds, setGroupIds] = useState([]);

  const columns = [
    {
      field: "groupName",
      headerAlign: "center",
      headerName: "그룹이름",
      minWidth: 100,
      flex: 1,
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
            onClick={() => navigate(`edit/${params.row.groupId}`)}
            style={{ fontFamily: 'GangwonEdu_OTFBoldA' }}
          >
            수정
          </Button>
        </div>
      ),
    },
  ];

  const [rows, setRows] = useState([]);

  const handleSelectGroup = (selectGroup) => {
    const selectedData = selectGroup
      .map((id) => rows.find((row) => row.id === id))
      .filter(Boolean);
    const selectGroupIds = selectedData.map((row) => row.groupId);
    console.log("selectMemberIds: ", selectGroupIds);
    setGroupIds(selectGroupIds);
  };

  // 그룹 목록 요청
  const getGroups = async () => {
    try {
      const response = await groupApi.getGroups();
      const groups = response.data;
      setRows(
        groups &&
          groups.map((data, idx) => {
            return {
              id: idx,
              ...data,
            };
          })
      );
    } catch (error) {
      console.error(`그룹 목록을 불러오는데 실패했습니다.`);
      console.error(`${error}`);
    }
  };

  // 그룹 삭제
  const deleteGroup = async (groupIds) => {
    try {
      await groupApi.deleteGroup({ groupIds });
      Swal.alert("그룹 삭제 성공", "", "success", () => {
        window.location.replace("/groups");
      });
    } catch (error) {
      console.error(`그룹 삭제에 실패하였습니다.`);
      console.error(`${error}`);
      Swal.alert("그룹 삭제 실패", "", "error");
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(selection) => {
          handleSelectGroup(selection);
        }}
        disableColumnMenu
        slots={{
          toolbar: () => (
            <CustomToolbar groupIds={groupIds} deleteGroup={deleteGroup} />
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
}

export default Groups;

const CustomToolbar = ({ groupIds, deleteGroup }) => {
  const navigate = useNavigate();

  return (
    <GridToolbarContainer>
      {/* <GridToolbarExport /> */}
      <Button onClick={() => navigate("create")}>
        <AddOutlined />
        그룹추가
      </Button>
      <Button
        onClick={() => {
          Swal.confirm("그룹 삭제", "그룹을 삭제하시겠습니까?", "warning", (result) => {
            if (result.isConfirmed) {
              deleteGroup(groupIds);
            }
          });
        }}
        disabled={groupIds.length === 0}
      >
        <RemoveOutlined />
        그룹삭제
      </Button>
    </GridToolbarContainer>
  );
};
