"use client";

import {
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Config } from "../Config";

export default function Room() {
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [expired, setExpired] = useState("");
  const [list, setList] = useState([]);

  const fetchData = async () => {
    const res = await axios.post(Config.BASE_URL + "/room", {});
    setList(res.data);
    console.log(res.data);
  };

  const insertRoom = async () => {
    if (!price || !total || !expired) {
      alert("데이터를 채워주세요.");
      return;
    }

    const res = await axios.post(Config.BASE_URL + "/room/create", {
      price: price,
      total: total,
      expired: expired,
    });
    alert(res.data);
    location.href = "/room";
  };

  const deleteRoom = async (id) => {
    const res = await axios.post(Config.BASE_URL + "/room/delete", {
      id: id,
    });
    alert(res.data);
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
    fetchData();
  }, []);

  return (
    <>
      <Container className="pt-10 bg-gray-300 flex-1 pb-10">
        <Typography color="primary" fontWeight={900}>
          로또방 관리
        </Typography>

        <>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">배팅금</Typography>
            <TextField
              id="price"
              label="배팅금"
              variant="filled"
              type="number"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">인원</Typography>
            <TextField
              id="total"
              label="인원"
              variant="filled"
              type="number"
              onChange={(e) => setTotal(Number(e.target.value))}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">마감일시</Typography>
            <TextField
              id="total"
              label="마감일시"
              variant="filled"
              type="text"
              onChange={(e) => setExpired(e.target.value)}
            />
          </Stack>
          <Stack direction={"row"} className="justify-between">
            <Box className="mt-3">
              <Button variant="contained" onClick={() => insertRoom()}>
                추가
              </Button>
            </Box>
            <Box className="mt-3">
              <Button
                variant="contained"
                onClick={() => {
                  location.href = "/room";
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
                  <TableCell>배팅금</TableCell>
                  <TableCell>현재원</TableCell>
                  <TableCell>총원</TableCell>
                  <TableCell>마감일시</TableCell>
                  <TableCell>삭제</TableCell>
                  <TableCell>보기</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.current}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>{dateToString(item.expired)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteRoom(item.id)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() =>
                          (location.href = "room/detail/" + item.id)
                        }
                      >
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}
