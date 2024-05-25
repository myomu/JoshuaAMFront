import { Suspense, useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import EditAttendanceCheck from "./EditAttendanceCheck";
import { CheckboxGroup } from "../checkbox/CheckboxGroup";
import { Checkbox } from "../checkbox/Checkbox";
import api from "../../apis/api";
import * as attendanceApi from "../../apis/attendanceApi";
import * as Swal from "../../apis/alert";
import AttendanceList from "./AttendanceList";
import Header from "../Header/Header";

const Attendances = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<div>로딩중임</div>}>
        <Routes>
          {/* <Route
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
        /> */}
          {/* <Route path="/create" element={<CreateMember />} /> */}
          <Route path="/" element={<AttendanceList />} />
          <Route path="/edit/:attendanceId" element={<EditAttendanceCheck />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Attendances;
