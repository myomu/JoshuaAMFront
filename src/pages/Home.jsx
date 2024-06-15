import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import api from "../apis/api";
import ApexCharts from "react-apexcharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Card, Col, Row } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
dayjs.extend(utc);

const Home = () => {
  // const response = api.get("/home/acount");
  // console.log(response);
  // console.log(response.data);

  const [attendanceCount, setAttendanceCount] = useState([]);
  const [absentee, setAbsentee] = useState([]);

  const getAttendanceCount = async () => {
    try {
      const response = await api.get("/home/attendance");
      const data = response.data;
      console.log(data);
      setAttendanceCount(data);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  const getLongTermAbsentee = async () => {
    try {
      const response = await api.get("/home/absentee");
      const data = response.data;
      console.log(data);
      setAbsentee(data);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  useEffect(() => {
    getAttendanceCount();
    getLongTermAbsentee();
  }, []);

  return (
    <>
      <Header />
      <div>
        <Row xs={1} md={2}>
          <Col className="mb-3">
            <Card>
              <Card.Body className="attendanceCountContainer">
              <h6>출석수</h6>
                <ApexCharts
                  type="line"
                  series={[
                    {
                      name: "출석수",
                      data: attendanceCount?.map((item) => item.totalMember),
                    },
                  ]}
                  options={{
                    chart: {
                      height: 350,
                      width: 300,
                      toolbar: {
                        show: false,
                      },
                      zoom: {
                        enabled: false,
                      },
                    },
                    stroke: {
                      curve: "smooth",
                      width: 3,
                    },
                    markers: {
                      size: 1,
                    },
                    dataLabels: {
                      enabled: true,
                    },
                    tooltip: {
                      enabled: true,
                      y: {
                        formatter: (value) => {
                          return value + "명";
                        }
                      }
                    },
                    yaxis: {
                      min: 5,
                      max: 40,
                    },
                    xaxis: {
                      // type: "datetime",
                      categories: attendanceCount?.map((item) =>
                        dayjs(item.attendanceDate).format("MM.DD")
                      ),
                    },
                  }}
                ></ApexCharts>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body className="absenteeContainer">
                <h6 className="absenteeTitle">지난 4주 간 1번도 출석하지 않은 사람</h6>
                {absentee?.map((a, i) => (
                  <Box className="absenteeBox" key={i}>
                    <Typography className="absentee">{a.memberName}</Typography>
                  </Box>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Home;
