"use client";
import { Config } from "@/app/Config";
import {
  Container,
  Typography,
  Stack,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatDetail() {
  const { id } = useParams();

  const [list, setList] = useState([]);

  const [boxType, setBoxType] = useState(0);
  const [text, setText] = useState("");
  const [isRead, setIsRead] = useState(0);

  const requestCreate = async () => {
    const res3 = await axios.post(Config.BASE_URL + "/message/create", {
      cid: id,
      boxType: boxType,
      text: encodeURIComponent(text),
      isRead: isRead,
    });
    alert(res3.data);
    location.reload();
  };

  const fetchList = async () => {
    const res = await axios.post(Config.BASE_URL + "/fetch/message", {
      cid: id,
    });

    setList(res.data);
  };

  const removeMessage = async (id) => {
    const res = await axios.post(Config.BASE_URL + "/message/delete", {
      id: id,
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
      fetchList();
    };
    k();
  }, []);

  return (
    <Container className="pt-10 bg-gray-300 flex-1 pb-10">
      <Box className="mb-5">
        <Link href={"/chat"}>
          <Typography color="primary">뒤로</Typography>
        </Link>
      </Box>
      <Typography color="primary" fontWeight={900}>
        채팅방 {id}
      </Typography>

      <>
        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">box type</Typography>
          <TextField
            id="boxtype"
            label="box type 1:user, 2:assistant"
            variant="filled"
            type="number"
            onChange={(e) => setBoxType(Number(e.target.value))}
          />
        </Stack>

        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">text</Typography>
          <TextField
            id="text"
            label="text"
            variant="filled"
            type="text"
            onChange={(e) => setText(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">is_read</Typography>
          <TextField
            id="is_read"
            label="is_read 1:read, 0:unread"
            variant="filled"
            type="number"
            onChange={(e) => setIsRead(Number(e.target.value))}
          />
        </Stack>

        <Stack direction={"row"} className="justify-between">
          <Box className="mt-3">
            <Button variant="contained" onClick={() => requestCreate()}>
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
                <TableCell>cid</TableCell>
                <TableCell>box type</TableCell>
                <TableCell>text</TableCell>
                <TableCell>is_read</TableCell>
                <TableCell>updated</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.cid}</TableCell>
                  <TableCell>{item.box_type}</TableCell>
                  <TableCell>{decodeURIComponent(item.text)}</TableCell>
                  <TableCell>{item.is_read}</TableCell>
                  <TableCell>{dateToString(item.updated)}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeMessage(item.id)}
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
