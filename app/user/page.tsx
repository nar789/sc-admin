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
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Config } from "../Config";

export default function User() {
  const [list, setList] = useState([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gold, setGold] = useState(0);

  const nickCache = useRef({});
  const phoneCache = useRef({});
  const addressCache = useRef({});
  const goldCache = useRef({});

  const deleteUser = async (id) => {
    const res = await axios.post(Config.BASE_URL + "/user/delete", {
      id: id,
    });
    alert(res.data);
    location.reload();
  };

  const insertUser = async () => {
    if (!id || !name || !email) {
      alert("데이터를 채워주세요.");
    }

    const res = await axios.post(Config.BASE_URL + "/user/create", {
      id: id,
      name: name,
      email: email,
      nick: nick,
      phone: phone,
      address: address,
      gold: gold,
    });
    alert(res.data);
    location.reload();
  };

  const fetchData = async () => {
    const res = await axios.post(Config.BASE_URL + "/user", {});
    setList(res.data);
    console.log(res.data);
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
    <>
      <Container className="pt-10 bg-gray-300 flex-1 pb-10">
        <Typography color="primary" fontWeight={900}>
          유저 관리
        </Typography>

        <>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">ID</Typography>
            <TextField
              id="id"
              label="ID"
              variant="filled"
              type="text"
              onChange={(e) => setId(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">이름</Typography>
            <TextField
              id="name"
              label="이름"
              variant="filled"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">이메일</Typography>
            <TextField
              id="email"
              label="이메일"
              variant="filled"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">닉네임</Typography>
            <TextField
              id="nick"
              label="닉네임"
              variant="filled"
              type="text"
              onChange={(e) => setNick(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">폰</Typography>
            <TextField
              id="phone"
              label="폰"
              variant="filled"
              type="text"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">주소</Typography>
            <TextField
              id="address"
              label="주소"
              variant="filled"
              type="text"
              onChange={(e) => setAddress(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-1 items-center"
            spacing={5}
          >
            <Typography color="primary">골드</Typography>
            <TextField
              id="gold"
              label="골드"
              variant="filled"
              type="number"
              onChange={(e) => setGold(Number(e.target.value))}
            />
          </Stack>
          <Stack direction={"row"} className="justify-between">
            <Box className="mt-3">
              <Button variant="contained" onClick={() => insertUser()}>
                추가
              </Button>
            </Box>
            <Box className="mt-3">
              <Button
                variant="contained"
                onClick={() => {
                  location.reload();
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
                  <TableCell>이름</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>닉네임</TableCell>
                  <TableCell>폰</TableCell>
                  <TableCell>주소</TableCell>
                  <TableCell>골드</TableCell>
                  <TableCell>생성</TableCell>
                  <TableCell>업뎃</TableCell>
                  <TableCell>수정</TableCell>
                  <TableCell>삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.nick}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.gold}</TableCell>
                    <TableCell>{dateToString(item.created)}</TableCell>
                    <TableCell>{dateToString(item.updated)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                          location.href = "/user/" + item.id;
                        }}
                      >
                        수정
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteUser(item.id)}
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
    </>
  );
}
