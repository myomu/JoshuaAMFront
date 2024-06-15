import React, { useEffect, useState } from "react";
import { Form, Card, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Checkbox } from "../checkbox/Checkbox";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import api from "../../apis/api";

import * as attendanceApi from "../../apis/attendanceApi";
import * as Swal from "../../apis/alert";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button } from "@mui/material";
dayjs.extend(utc);

const EditAttendanceCheck = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState();
  const { attendanceId } = useParams();

  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectYear, setSelectYear] = useState();
  const [selectMonth, setSelectMonth] = useState();
  const [selectDay, setSelectDay] = useState();
  const [memberIds, setMemberIds] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState();

  const [loading, setLoading] = useState(true);

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

  const getEditAttendanceCheck = async () => {
    try {
      const response = await attendanceApi.getEditAttendanceCheck(attendanceId);
      const data = response.data;
      setMemberIds(data.checkedMemberIds.map((member) => member.memberId));
      setAttendanceDate(data.attendanceDate);

      const dateTime = dayjs.utc(data.attendanceDate).local();
      console.log(dateTime);
      setSelectYear(dateTime.year());
      setSelectMonth(dateTime.month() + 1);
      setSelectDay(dateTime.date());
      setLoading(false);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  const editAttendance = async (form) => {
    try {
      await attendanceApi.editAttendance(attendanceId, form);
      Swal.alert("출석 수정 성공", "", "success", () => {
        window.location.replace("/attendances");
      });
    } catch (error) {
      console.error(`${error}`);
      Swal.alert("출석 수정 실패", "", "error");
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

    // api
    // .get(`/attendances/edit/` + attendanceId)
    // .then((response) => {
    //   setMemberIds(response.data.checkedMemberIds.map((member) => member.memberId));
    //   setAttendanceDate(response.data.attendanceDate);

    //   const dateTime = new Date(response.data.attendanceDate);
    //   setSelectYear(dateTime.getFullYear());
    //   setSelectMonth(dateTime.getMonth() + 1);
    //   setSelectDay(dateTime.getDate());
    //   setLoading(false);
    // })
    // .catch((error) => console.log(error));

    getAttendanceCheck();
    getEditAttendanceCheck();
  }, []);

  // useEffect(() => {
  //   //   const fetchData = async () => {
  //   //     try {
  //   //     } catch (error)
  //   //   }
  //   // fetchData();
  // }, [attendanceId]);

  const handleSubmit = (event) => {
    event.preventDefault(); //페이지 리로드 방지.

    memberIds.sort();

    const year = parseInt(selectYear);
    const month = parseInt(selectMonth) - 1;
    const day = parseInt(selectDay);
    const localDate = new Date(year, month, day);
    //Spring 서버에서 LocalDateTime 으로 JSON 타입을 받을 때
    //역직렬화가 실패하지 않도록 하기 위해서 타입을 맞춰준다.
    //중간에 T 가 필요하기 때문에 추가.
    const editDateTime = dayjs(localDate).format("YYYY-MM-DDTHH:mm:ss");
    let formData;

    if (switchChecked === true) {
      formData = {
        memberIds: memberIds,
        attendanceDate: editDateTime,
      };
    } else {
      //날짜 선택 switch 가 false 일 경우 다시 년,월,일 을 null로 설정
      formData = {
        memberIds: memberIds,
        attendanceDate: attendanceDate,
      };
    }
    
    editAttendance(formData);

    //   api
    //     .post(`/attendances/edit/` + attendanceId, formData, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response);
    //       alert("출석 수정에 성공하였습니다.");
    //       window.location.replace("/attendances");
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //       alert("출석 수정에 실패하였습니다.");
    //     });
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

  if (!loading) {
    return (
      <div className="container">
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
                        - 수동 입력을 하지 않을 시 기존의 날짜를 기준으로
                        저장합니다.
                      </small>
                    </span>
                  }
                  checked={switchChecked}
                  onChange={handleSwitchChange}
                />
              </Form.Group>
              <Row>
                <Form.Group as={Col}>
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
                <Form.Group as={Col}>
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
                <Form.Group as={Col}>
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
          
          <div style={{marginBottom: "20px"}}>
          <Button
            variant="contained"
            type="submit"
            className="btnSave"
            disabled={memberIds.length === 0}
            style={{ fontFamily: 'GangwonEdu_OTFBoldA' }}
          >
            저장
          </Button>
          <Button
            variant="contained"
            style={{ marginLeft: "5px", fontFamily: 'GangwonEdu_OTFBoldA' }}
            onClick={() => {
              navigate("/attendances");
            }}
          >
            취소
          </Button>
          </div>
        </Form>
      </div>
    );
  } else {
    return (
      <div>
        <p>로딩중 입니다.</p>
      </div>
    );
  }
};

export default EditAttendanceCheck;
