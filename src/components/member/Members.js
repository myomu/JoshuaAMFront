import { Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateMember from "./CreateMember";
import { Button, Form, Table } from "react-bootstrap";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import { Checkbox } from "../checkbox/Checkbox";
import EditMember from "./EditMember";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import api from "../../apis/api";

function Members() {
  let navigate = useNavigate();

  const [members, setMembers] = useState("");

  const [memberIds, setMemberIds] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDate = (value) => {
    setStartDate(value);
  };
  const handleEndDate = (value) => {
    setEndDate(value);
  };

  const Server = `${process.env.REACT_APP_Server}`;

  useEffect(() => {
    const params = {
      startDate: startDate != null ? dayjs(startDate).format("YYYY-MM-DDTHH:mm") : null,
      endDate: endDate != null ? dayjs(endDate).format("YYYY-MM-DDTHH:mm") : null,
    };

    api
      .get(`${Server}/api/members`, { params })
      .then((response) => {
        setMembers(response.data);
        console.log("---");
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, [startDate, endDate]);

  const handleSubmit = (event) => {
    event.preventDefault(); //페이지 리로드 방지.

    console.log(memberIds);
    memberIds.sort();

    const formData = {
      memberIds: memberIds,
    };

    api
      .post(`${Server}/api/members/delete`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        alert("회원 삭제에 성공하였습니다.");
        window.location.replace("/members");
      })
      .catch(function (error) {
        console.log(error);
        alert("회원 삭제에 실패하였습니다.");
      });
  };

  return (
    <div>
      <Suspense fallback={<div>로딩중임</div>}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
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
                    회원추가
                  </Button>
                  <Form onSubmit={handleSubmit}>
                    <Button
                      variant="warning"
                      type="submit"
                      className="btnSave"
                      disabled={memberIds.length === 0}
                    >
                      회원 삭제
                    </Button>
                    <CheckboxGroup
                      label="출석체크 인원"
                      values={memberIds}
                      onChange={setMemberIds}
                    >
                      <p>회원리스트</p>
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
                      </div>
                      <Table
                        bordered
                        hover
                        className="text-nowrap text-center align-middle customTable"
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>이름</th>
                            <th>나이</th>
                            <th>성별</th>
                            <th>조 이름</th>
                            <th>출석률</th>
                            <th>구분</th>
                            <th>수정</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members
                            ? members.map((a, i) => (
                                <tr key={i}>
                                  <td>
                                    <Checkbox value={a.memberId}></Checkbox>
                                  </td>
                                  <td>{i + 1}</td>
                                  <td>{a.name}</td>
                                  <td>{a.dateOfBirth}</td>
                                  <td>
                                    {a.gender === "MAN" ? "남자" : "여자"}
                                  </td>
                                  <td>{a.groupName}</td>
                                  <td>{a.attendanceRate}%</td>
                                  <td>
                                    {a.memberStatus === "MEMBER"
                                      ? "회원"
                                      : "비회원"}
                                  </td>
                                  <td>
                                    <Button
                                      variant="light"
                                      onClick={() => {
                                        navigate("edit/" + a.memberId);
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
            <Route path="/create" element={<CreateMember />} />
            <Route path="/edit/:memberId" element={<EditMember />} />
          </Routes>
        </LocalizationProvider>
      </Suspense>
    </div>
  );
}

export default Members;
