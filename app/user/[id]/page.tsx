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
import Link from "next/link";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Config } from "@/app/Config";

export default function UserDetail() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gold, setGold] = useState(0);

  const fetchData = async () => {
    const res = await axios.post(Config.BASE_URL + "/user-by-id", {
      id: id,
    });

    console.log(res.data);
    setName(res.data.name);
    setEmail(res.data.email);
    setNick(res.data.nick);
    setPhone(res.data.phone);
    setAddress(res.data.address);
    setGold(Number(res.data.gold));
  };

  const updateUser = async () => {
    const res = await axios.post(Config.BASE_URL + "/user/update", {
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

  useEffect(() => {
    const k = () => {
      fetchData();
    };
    k();
  }, []);

  return (
    <Container className="pt-10 bg-gray-300 flex-1 pb-10">
      <Box className="mb-5">
        <Link href={"/user"}>
          <Typography color="primary">뒤로</Typography>
        </Link>
      </Box>
      <Typography color="primary" fontWeight={900}>
        유저정보 {id}
      </Typography>

      <>
        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">이름</Typography>
          <TextField
            id="name"
            label="이름"
            variant="filled"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">이메일</Typography>
          <TextField
            id="email"
            label="이메일"
            variant="filled"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">닉네임</Typography>
          <TextField
            id="nick"
            label="닉네임"
            variant="filled"
            type="text"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">폰</Typography>
          <TextField
            id="phone"
            label="폰"
            variant="filled"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">주소</Typography>
          <TextField
            id="address"
            label="주소"
            variant="filled"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">골드</Typography>
          <TextField
            id="gold"
            label="골드"
            variant="filled"
            type="number"
            value={gold}
            onChange={(e) => setGold(Number(e.target.value))}
          />
        </Stack>
        <Stack direction={"row"} className="justify-between">
          <Box className="mt-3">
            <Button variant="contained" onClick={() => updateUser()}>
              저장
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
    </Container>
  );
}
