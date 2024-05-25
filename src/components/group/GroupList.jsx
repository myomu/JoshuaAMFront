import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import * as Swal from "../../apis/alert";
import * as groupApi from "../../apis/groupApi";

function Groups() {
  let navigate = useNavigate();

  // const [groups, setGroups] = useState("");
  const [groupIds, setGroupIds] = useState([]);

  const columns = [
    { field: "groupName", headerName: "그룹이름" },
    {
      field: "edit",
      headerName: "수정",
      renderCell: (params) => (
        <Button
          color="primary"
          variant="contained"
          onClick={() => navigate(`edit/${params.row.groupId}`)}
        >
          수정
        </Button>
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
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(selection) => {
          handleSelectGroup(selection);
        }}
        disableColumnMenu
        // slotProps={{
        //   toolbar: { csvOptions: { fields: ["name", "birthdate", "gender", "groupName", "memberStatus", "attendanceRate"]}}
        // }}
        slots={{
          toolbar: () => (
            <CustomToolbar groupIds={groupIds} deleteGroup={deleteGroup} />
          ),
        }}
      />
    </div>
  );
}

export default Groups;

const CustomToolbar = ({ groupIds, deleteGroup }) => {
  const navigate = useNavigate();

  return (
    <GridToolbarContainer>
      <GridToolbarExport />
      <Button onClick={() => navigate("create")}>그룹추가</Button>
      <Button
        onClick={() => {
          Swal.confirm("그룹을 삭제하시겠습니까?", "", "warning", (result) => {
            if (result.isConfirmed) {
              deleteGroup(groupIds);
            }
          });
        }}
        disabled={groupIds.length === 0}
      >
        그룹삭제
      </Button>
    </GridToolbarContainer>
  );
};
