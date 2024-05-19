import { Suspense, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import EditAttendanceCheck from "./EditAttendanceCheck";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import { Checkbox } from "../checkbox/Checkbox";
import api from "../../apis/api";

function Attendances() {
  const [attendances, setAttendances] = useState("");
  const [attendanceIds, setAttendanceIds] = useState([]);
  useEffect(() => {
    api
      .get(`/attendances`)
      .then((response) => {
        setAttendances(response.data);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); //페이지 리로드 방지.
    console.log(attendanceIds);
    // memberIds.sort();

    const formData = {
      attendanceIds: attendanceIds,
    };

    api
      .post(`/attendances`, formData, {
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then((response) => {
        console.log(response);
        alert("출석 삭제에 성공하였습니다.");
        window.location.replace("/attendances");
      })
      .catch(function (error) {
        console.log(error);
        alert("출석 삭제에 실패하였습니다.");
      });
  };

  return (
    <div>
      <p>출석리스트 화면</p>
      <Suspense fallback={<div>로딩중임</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="table-responsive">
                <Form onSubmit={handleSubmit}>
                  <Button
                    variant="warning"
                    type="submit"
                    className="btnSave"
                    disabled={attendanceIds.length === 0}
                  >
                    출석 삭제
                  </Button>
                  <CheckboxGroup
                    label="출석체크 인원"
                    values={attendanceIds}
                    onChange={setAttendanceIds}
                  >
                    <Table bordered hover className="text-nowrap customTable">
                      <thead>
                        <tr className="text-center align-middle">
                          <th>#</th>
                          <th>날짜</th>
                          <th>출석인원</th>
                          <th>총인원</th>
                          <th>수정</th>
                        </tr>
                      </thead>

                      <AttendanceList attendances={attendances} />
                    </Table>
                  </CheckboxGroup>
                </Form>
              </div>
            }
          />
          {/* <Route path="/create" element={<CreateMember />} /> */}
          <Route path="/edit/:attendanceId" element={<EditAttendanceCheck />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default Attendances;

export function AttendanceList({ attendances }) {
  const navigate = useNavigate();

  return (
    <tbody style={{ fontSize: "14px" }}>
      {attendances
        ? attendances.map((a, i) => {
            const date = new Date(a.attendanceDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            const formattedDate = `${year}-${month}-${day}`;

            return (
              <tr key={i} className="text-center align-middle">
                <td>
                  <Checkbox value={a.attendanceId}></Checkbox>
                </td>
                <td>{formattedDate}</td>
                <td>
                  <Row xs="auto">
                    {a.attendanceDataDtoList.map((b, j) => (
                      <Col key={j}>
                        <div>{b.memberName}</div>
                      </Col>
                    ))}
                  </Row>
                </td>
                <td>{a.totalMember}</td>
                <td>
                  <Button
                    variant="light"
                    onClick={() => {
                      navigate("edit/" + a.attendanceId);
                    }}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Button>
                </td>
              </tr>
            );
          })
        : null}
    </tbody>
  );
}
