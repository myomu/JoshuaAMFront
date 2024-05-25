import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MemberList from "./MemberList";
import CreateMember from "./CreateMember";
import EditMember from "./EditMember";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ko";
// dayjs 타임존 설정.
// 하위 route 들에서도 이 설정으로 진행되는 것으로 예상도미.
// 표시되는 시간대가 서버(UTC) -> 클라이언트(GMT+9) 로 변경되는듯.
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Header from "../Header/Header";
dayjs.extend(utc);
dayjs.extend(timezone);

const Members = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<div>로딩중임</div>}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <Routes>
            <Route path="/" element={<MemberList />} />
            <Route path="/create" element={<CreateMember />} />
            <Route path="/edit/:memberId" element={<EditMember />} />
          </Routes>
        </LocalizationProvider>
      </Suspense>
    </>
  );
};

export default Members;
