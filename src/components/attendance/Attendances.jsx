import { Suspense } from "react";
import { Route, Routes} from "react-router-dom";
import EditAttendanceCheck from "./EditAttendanceCheck";
import AttendanceList from "./AttendanceList";
import Header from "../Header/Header";

const Attendances = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<div>로딩중임</div>}>
        <Routes>
          <Route path="/" element={<AttendanceList />} />
          <Route path="/edit/:attendanceId" element={<EditAttendanceCheck />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Attendances;
