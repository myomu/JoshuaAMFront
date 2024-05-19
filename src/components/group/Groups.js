import { Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import { Button, Form, Table } from "react-bootstrap";
import EditGroup from "./EditGroup";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import { Checkbox } from "../checkbox/Checkbox";
import api from "../../apis/api";

function Groups() {
  let navigate = useNavigate();

  const [groups, setGroups] = useState("");
  const [groupIds, setGroupIds] = useState([]);
  const Server = `${process.env.REACT_APP_Server}`;

  useEffect(() => {
    api
      .get(`/api/groups`)
      .then((response) => {
        setGroups(response.data);
        console.log("---");
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); //페이지 리로드 방지.

    console.log(groupIds);
    groupIds.sort();

    const formData = {
      groupIds: groupIds,
    };

    api
      .post(`/api/groups/delete`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        alert("그룹 삭제에 성공하였습니다.");
        window.location.replace("/groups");
      })
      .catch(function (error) {
        console.log(error);
        alert("그룹 삭제에 실패하였습니다.");
      });
  };

  return (
    <div>
      <Suspense fallback={<div>로딩중임</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Button
                  onClick={() => {
                    navigate("create");
                  }}
                >
                  그룹 추가
                </Button>

                <p>그룹 리스트</p>
                <Form onSubmit={handleSubmit}>
                  <Button
                    variant="warning"
                    type="submit"
                    className="btnSave"
                    disabled={groupIds.length === 0}
                  >
                    그룹 삭제
                  </Button>
                  <CheckboxGroup
                    label="출석체크 인원"
                    values={groupIds}
                    onChange={setGroupIds}
                  >
                    <Table
                      bordered
                      hover
                      className="text-nowrap text-center align-middle customTable"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>ID</th>
                          <th>조 이름</th>
                          <th>수정</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups
                          ? groups.map((a, i) => (
                              <tr key={i}>
                                <td>
                                  <Checkbox value={a.groupId}></Checkbox>
                                </td>
                                <td>{i + 1}</td>
                                <td>{a.groupName}</td>
                                <td>
                                  <Button
                                    variant="light"
                                    onClick={() => {
                                      navigate("edit/" + a.groupId);
                                    }}
                                  >
                                    <i className="fa-regular fa-pen-to-square"></i>
                                  </Button>
                                </td>
                              </tr>
                            ))
                          : null}
                      </tbody>
                    </Table>
                  </CheckboxGroup>
                </Form>
              </>
            }
          />
          <Route path="/create" element={<CreateGroup />} />
          <Route path="/edit/:groupId" element={<EditGroup />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default Groups;
