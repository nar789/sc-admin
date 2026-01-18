"use client";
import {
  Box,
  Button,
  ButtonBase,
  Container,
  Stack,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import { MuiFileInput } from "mui-file-input";
import { useEffect, useState } from "react";
import { Config } from "../Config";
import Image from "next/image";
import Link from "next/link";

export default function Friends() {
  const [file, setfile] = useState(null);
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [ment, setMent] = useState("");
  const [follwer, setFollwer] = useState(0);
  const [following, setFollowing] = useState(0);

  const [list, setList] = useState([]);

  const uploadPreview = async (file) => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("img", file);

    if (file) {
      const res = await axios.post(Config.BASE_URL + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [() => formData],
      });

      console.log(res.data);
      setImg(res.data);
    }
  };

  const requestCreate = async () => {
    if (!name || !ment || !img) {
      alert("데이터를 채워주세요.");
      return;
    }

    const res = await axios.post(Config.BASE_URL + "/friends/create", {
      name: name,
      ment: encodeURIComponent(ment),
      img: img,
      follower: follwer,
      following: following,
    });
    if (res.data === "success") {
      alert("추가가 완료되었습니다.");
      location.reload();
    }
  };

  const fetchList = async () => {
    const res = await axios.post(Config.BASE_URL + "/fetch/friends", {});
    if (res.data) {
      setList(res.data);
    }
  };

  const removeFriends = async (id) => {
    const res = await axios.post(Config.BASE_URL + "/friends/delete", {
      id: id,
    });
    alert(res.data);
    location.reload();
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
          친구관리
        </Typography>

        <>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">이름</Typography>
            <TextField
              id="id"
              label="이름"
              variant="filled"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">멘트</Typography>
            <TextField
              id="ment"
              label="멘트"
              variant="filled"
              type="text"
              onChange={(e) => setMent(e.target.value)}
            />
          </Stack>

          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">프로필</Typography>
            <MuiFileInput value={file} onChange={(v) => uploadPreview(v)} />
          </Stack>
          <Box className="bg-gray-300">
            {img && (
              <ButtonBase
                onClick={() => {
                  window.open(Config.BASE_URL + "/uploads/" + img, "_blank");
                }}
              >
                <Image
                  className="mt-5"
                  width={200}
                  height={200}
                  src={Config.BASE_URL + "/uploads/" + img}
                  alt="img"
                />
              </ButtonBase>
            )}
          </Box>
          {img && (
            <Box>
              <ButtonBase
                onClick={() => {
                  setImg("");
                  setfile(null);
                }}
              >
                <Typography color="primary">삭제</Typography>
              </ButtonBase>
            </Box>
          )}

          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">팔로워</Typography>
            <TextField
              id="follower"
              label="팔로워"
              variant="filled"
              type="number"
              defaultValue={0}
              onChange={(e) => setFollwer(Number(e.target.value))}
            />
          </Stack>
          <Stack
            direction={"row"}
            className="flex mt-3 items-center"
            spacing={5}
          >
            <Typography color="primary">팔로잉</Typography>
            <TextField
              id="following"
              label="팔로잉"
              variant="filled"
              type="number"
              defaultValue={0}
              onChange={(e) => setFollowing(Number(e.target.value))}
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
                  <TableCell>이름</TableCell>
                  <TableCell>멘트</TableCell>
                  <TableCell>아바타</TableCell>
                  <TableCell>팔로워</TableCell>
                  <TableCell>팔로잉</TableCell>
                  <TableCell>보기</TableCell>
                  <TableCell>삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{decodeURIComponent(item.ment)}</TableCell>
                    <TableCell>
                      <ButtonBase
                        onClick={() =>
                          window.open(
                            Config.BASE_URL + "/uploads/" + item.avatar,
                            "_blank"
                          )
                        }
                      >
                        <Image
                          alt="avatar"
                          width={200}
                          height={200}
                          src={Config.BASE_URL + "/uploads/" + item.avatar}
                        />
                      </ButtonBase>
                    </TableCell>
                    <TableCell>{item.follwer}</TableCell>
                    <TableCell>{item.following}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={() => {
                          location.href = "/friends/" + item.id;
                        }}
                      >
                        보기
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => removeFriends(item.id)}
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
