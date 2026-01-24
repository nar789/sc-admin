"use client";
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
import { useEffect, useState } from "react";
import { Config } from "../Config";

export default function Chat() {
  const [list, setList] = useState([]);

  const [fid, setFid] = useState(0);
  const [uid, setUid] = useState("");
  const [boxType, setBoxType] = useState(0);
  const [text, setText] = useState("");
  const [isRead, setIsRead] = useState(0);

  const requestCreate = async () => {
    const res = await axios.post(
      Config.BASE_URL + "/fetch/conversation-by-id",
      {
        uid: uid,
        fid: fid,
      },
    );
    let cid = -1;
    if (res.data) {
      cid = res.data.id;
    } else {
      const res2 = await axios.post(Config.BASE_URL + "/conversation/create", {
        uid: uid,
        fid: fid,
      });
      cid = res2.data.id;
    }

    const res3 = await axios.post(Config.BASE_URL + "/message/create", {
      cid: cid,
      boxType: boxType,
      text: encodeURIComponent(text),
      isRead: isRead,
    });
    alert(res3.data);
    location.reload();
  };

  const removeConversation = async (id) => {
    const res = await axios.post(Config.BASE_URL + "/conversation/delete", {
      id: id,
    });

    alert(res.data);
    location.reload();
  };

  const fetchList = async () => {
    const res = await axios.post(Config.BASE_URL + "/fetch/conversation", {});

    setList(res.data);
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
    <>
      <Container className="pt-10 bg-gray-300 flex-1 pb-10">
        <Typography color="primary" fontWeight={900}>
          채팅방 관리
        </Typography>

        <>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">fid</Typography>
            <TextField
              id="fid"
              label="fid"
              variant="filled"
              type="number"
              onChange={(e) => setFid(Number(e.target.value))}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">uid</Typography>
            <TextField
              id="uid"
              label="uid"
              variant="filled"
              type="text"
              onChange={(e) => setUid(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">box type</Typography>
            <TextField
              id="boxtype"
              label="box type 1:user, 2:assistant"
              variant="filled"
              type="number"
              onChange={(e) => setBoxType(Number(e.target.value))}
            />
          </Stack>

          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">text</Typography>
            <TextField
              id="text"
              label="text"
              variant="filled"
              type="text"
              onChange={(e) => setText(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
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
                  <TableCell>fid</TableCell>
                  <TableCell>uid</TableCell>
                  <TableCell>snippet</TableCell>
                  <TableCell>unread</TableCell>
                  <TableCell>updated</TableCell>
                  <TableCell>보기</TableCell>
                  <TableCell>삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.fid}</TableCell>
                    <TableCell>{item.uid}</TableCell>
                    <TableCell>{decodeURIComponent(item.snippet)}</TableCell>
                    <TableCell>{item.unread}</TableCell>
                    <TableCell>{dateToString(item.updated)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                          location.href = "/chat/" + item.id;
                        }}
                      >
                        보기
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => removeConversation(item.id)}
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
