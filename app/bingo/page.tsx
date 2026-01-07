"use client";
import {
  Box,
  Button,
  Container,
  Stack,
  TableContainer,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useReducer, useRef, useState } from "react";
import axios from "axios";
import { Config } from "../Config";

export default function Bingo() {
  const [lot, setLot] = useState("");
  const [expired, setExpired] = useState("");
  const [list, setList] = useState([]);
  const statusMap = useRef({});

  const insertBingo = async () => {
    if (!lot || !expired) {
      alert("데이터를 채워쥇요.");
    }

    const res = await axios.post(Config.BASE_URL + "/bingo/create", {
      lot: lot,
      expired: expired,
    });
    alert(res.data);
    location.href = "/bingo";
  };

  const fetchData = async () => {
    const res = await axios.post(Config.BASE_URL + "/bingo", {});
    setList(res.data);
    res.data.forEach((item, idx) => {
      statusMap.current[idx] = item.status;
    });
    console.log(res.data);
  };

  const deleteBingo = async (id) => {
    const res = await axios.post(Config.BASE_URL + "/bingo/delete", {
      id: id,
    });
    alert(res.data);
    location.href = "/bingo";
  };

  const updateBingo = async (id, idx) => {
    const res = await axios.post(Config.BASE_URL + "/bingo/update", {
      id: id,
      status: statusMap.current[idx],
    });
    alert(res.data);
    location.reload();
  };

  const dateToString = (timestamp) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString("ko-KR", options);
  };

  useEffect(() => {
    const k = () => {
      fetchData();
    };
    k();
  }, []);

  return (
    <Container className="pt-10 bg-gray-300 flex-1 pb-10">
      <Typography color="primary" fontWeight={900}>
        당첨번호 관리
      </Typography>

      <>
        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">당첨번호</Typography>
          <TextField
            id="lot"
            label="당첨번호"
            variant="filled"
            type="text"
            onChange={(e) => setLot(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">마감일시</Typography>
          <TextField
            id="expired"
            label="마감일시"
            variant="filled"
            type="text"
            onChange={(e) => setExpired(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="justify-between">
          <Box className="mt-3">
            <Button variant="contained" onClick={() => insertBingo()}>
              추가
            </Button>
          </Box>
          <Box className="mt-3">
            <Button
              variant="contained"
              onClick={() => {
                location.href = "/bingo";
              }}
            >
              새로고침
            </Button>
          </Box>
        </Stack>
      </>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>당첨번호</TableCell>
                <TableCell>마감일시</TableCell>
                <TableCell>오픈상태</TableCell>
                <TableCell>수정</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>{dateToString(item.expired)}</TableCell>
                  <TableCell>
                    <TextField
                      id="status"
                      label="오픈상태"
                      variant="filled"
                      type="number"
                      defaultValue={item.status}
                      onChange={(e) => {
                        statusMap.current[idx] = Number(e.target.value);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => updateBingo(item.id, idx)}
                    >
                      수정
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteBingo(item.id)}
                    >
                      삭제
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
