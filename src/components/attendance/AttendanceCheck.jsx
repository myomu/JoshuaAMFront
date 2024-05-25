import React, { useEffect, useState } from "react";
import { Form, Card, Col, Row } from "react-bootstrap";
import { Checkbox } from "../checkbox/Checkbox";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import dayjs from "dayjs";
import api from "../../apis/api";
import { Button } from "@mui/material";
import Header from "../Header/Header";
import * as attendanceApi from "../../apis/attendanceApi";
import * as Swal from "../../apis/alert";

const AttendanceCheck = () => {
  const [members, setMembers] = useState("");
  const [memberIds, setMemberIds] = useState([]);

  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectYear, setSelectYear] = useState();
  const [selectMonth, setSelectMonth] = useState();
  const [selectDay, setSelectDay] = useState();

  const getAttendanceCheck = async () => {
    try {
      const response = await attendanceApi.getAttendanceCheck();
      const members = response.data;
      setMembers(members);
    } catch (error) {
      console.error(`출석체크 목록을 불러오는데 실패했습니다.`);
      console.error(`${error}`);
    }
  };

  const createAttendance = async (form) => {
    try {
      await attendanceApi.createAttendance(form);
      Swal.alert("출석 추가 성공", "", "success", () => {
        window.location.replace("/attendances");
      });
    } catch (error) {
      console.error(`${error}`);
      Swal.alert("출석 추가 실패", "", "error");
    }
  };

  useEffect(() => {
    // api
    //   .get(`/attendances/check`)
    //   .then((response) => {
    //     setMembers(response.data);
    //     console.log("---");
    //     console.log(response.data);
    //   })
    //   .catch((error) => console.log(error));
    getAttendanceCheck();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); //페이지 리로드 방지.
    memberIds.sort();
    console.log(memberIds);

    const year = parseInt(selectYear);
    const month = parseInt(selectMonth) - 1;
    const day = parseInt(selectDay);
    const localDate = new Date(year, month, day);
    //Spring 서버에서 LocalDateTime 으로 JSON 타입을 받을 때
    //역직렬화가 실패하지 않도록 하기 위해서 타입을 맞춰준다.
    //중간에 T 가 필요하기 때문에 추가.
    let attendanceDate = dayjs(localDate).format("YYYY-MM-DDTHH:mm:ss");
    let formData;

    if (switchChecked === true) {
      formData = {
        memberIds: memberIds,
        attendanceDate: attendanceDate,
      };
    } else {
      //날짜 선택 switch 가 false 일 경우 다시 년,월,일 을 null로 설정
      formData = {
        memberIds: memberIds,
        attendanceDate: null,
      };
    }

    createAttendance(formData);

    // api
    //   .post(`/attendances/create`, formData, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     alert("출석 추가에 성공하였습니다.");
    //     window.location.replace("/attendances");
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     alert("출석 추가에 실패하였습니다.");
    //   });
  };

  const handleSwitchChange = () => {
    setSwitchChecked(!switchChecked);
  };

  const handleSelectYearChange = (e) => {
    setSelectYear(e.target.value);
  };
  const handleSelectMonthChange = (e) => {
    setSelectMonth(e.target.value);
  };
  const handleSelectDayChange = (e) => {
    setSelectDay(e.target.value);
  };

  // 현재 연도, 일 가져오기(월의 경우 항상 12개월이므로 생략)
  const currentYear = new Date().getFullYear();

  //Date에서 날을 0으로 주면 달의 마지막 날을 반환한다.
  const daysInYearAndMonth = new Date(selectYear, selectMonth, 0).getDate();

  // 연도, 월, 일 배열 생성
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: daysInYearAndMonth }, (_, i) => i + 1);

  return (
    <div>
      <Header />
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Body>
            <p>수동 날짜 입력</p>
            <Form.Group>
              <Form.Check
                type="switch"
                id="custom-switch"
                label={
                  <span>
                    날짜 입력
                    <small>
                      {" "}
                      - 수동 입력을 하지 않을 시 현재 날짜를 기준으로
                      저장합니다.
                    </small>
                  </span>
                }
                checked={switchChecked}
                onChange={handleSwitchChange}
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} className="selectMenu mt-2">
                <Form.Select
                  value={selectYear}
                  onChange={handleSelectYearChange}
                  disabled={!switchChecked}
                >
                  <option value="">연도</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="selectMenu mt-2">
                <Form.Select
                  value={selectMonth}
                  onChange={handleSelectMonthChange}
                  disabled={!switchChecked}
                >
                  <option value="">월</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="selectMenu mt-2">
                <Form.Select
                  value={selectDay}
                  onChange={handleSelectDayChange}
                  disabled={!switchChecked}
                >
                  <option value="">일</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}일
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        <CheckboxGroup
          // label="출석체크 인원"
          values={memberIds}
          onChange={setMemberIds}
        >
          {members
            ? members.map((a, i) => (
                <div key={i}>
                  <Card className="mb-3">
                    <Card.Header>
                      <p>{a.groupName}</p>
                    </Card.Header>
                    <Card.Body>
                      {a.members
                        ? a.members.map((b, j) => (
                            // <Form.Check key={j} inline className="memberClass" type="checkbox" id={b.memberId} label={b.name} />
                            <Checkbox key={j} value={b.memberId}>
                              {b.name}
                            </Checkbox>
                          ))
                        : null}
                    </Card.Body>
                  </Card>
                </div>
              ))
            : null}
        </CheckboxGroup>

        <Button
          variant="contained"
          type="submit"
          className="btnSave"
          disabled={memberIds.length === 0}
        >
          출석 추가
        </Button>
      </Form>
    </div>
  );
};

export default AttendanceCheck;
