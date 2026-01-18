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
  ButtonBase,
  Divider,
} from "@mui/material";
import Link from "next/link";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Config } from "@/app/Config";
import { MuiFileInput } from "mui-file-input";
import Image from "next/image";

export default function FriendsDetail() {
  const { id } = useParams();

  const [file, setfile] = useState(null);
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [ment, setMent] = useState("");
  const [follwer, setFollwer] = useState(0);
  const [following, setFollowing] = useState(0);

  const [feedList, setFeedList] = useState([]);

  const [file2, setfile2] = useState(null);
  const [img2, setImg2] = useState("");

  const fetchData = async () => {
    const res = await axios.post(Config.BASE_URL + "/fetch/friends-by-id", {
      id: id,
    });

    console.log(res.data);
    setName(res.data.name);
    setMent(decodeURIComponent(res.data.ment));
    setImg(res.data.avatar);
    setFollwer(res.data.follwer);
    setFollowing(res.data.following);
  };

  const fetchFeeds = async () => {
    const res = await axios.post(Config.BASE_URL + "/fetch/feed-by-fid", {
      fid: id,
    });
    setFeedList(res.data);
  };

  const updateFriends = async () => {
    const res = await axios.post(Config.BASE_URL + "/friends/update", {
      id: id,
      name: name,
      ment: encodeURIComponent(ment),
      img: img,
      follower: follwer,
      following: following,
    });
    alert(res.data);
    location.reload();
  };

  const createFeed = async () => {
    const res = await axios.post(Config.BASE_URL + "/feed/create", {
      fid: id,
      img: img2,
    });
    alert(res.data);
    location.reload();
  };

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

  const uploadPreview2 = async (file) => {
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
      setImg2(res.data);
    }
  };

  const removeFeed = async (feedId) => {
    const res = await axios.post(Config.BASE_URL + "/feed/delete", {
      id: feedId,
    });
    alert(res.data);
    location.reload();
  };

  useEffect(() => {
    const k = () => {
      fetchData();
      fetchFeeds();
    };
    k();
  }, []);

  return (
    <Container className="pt-10 bg-gray-300 flex-1 pb-10">
      <Box className="mb-5">
        <Link href={"/friends"}>
          <Typography color="primary">뒤로</Typography>
        </Link>
      </Box>
      <Typography color="primary" fontWeight={900}>
        친구정보 {id}
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
          <Typography color="primary">멘트 </Typography>
          <TextField
            id="ment"
            label="멘트"
            variant="filled"
            type="text"
            value={ment}
            onChange={(e) => setMent(e.target.value)}
          />
        </Stack>

        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">아바타</Typography>
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
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">팔로워</Typography>
          <TextField
            id="follower"
            label="팔로워"
            variant="filled"
            type="text"
            value={follwer}
            onChange={(e) => setFollwer(Number(e.target.value))}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">팔로잉</Typography>
          <TextField
            id="following"
            label="팔로잉"
            variant="filled"
            type="text"
            value={following}
            onChange={(e) => setFollowing(Number(e.target.value))}
          />
        </Stack>
        <Stack direction={"row"} className="justify-between">
          <Box className="mt-3">
            <Button variant="contained" onClick={() => updateFriends()}>
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
        <Box className="my-5">
          <Divider />
        </Box>

        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">피드 사진</Typography>
          <MuiFileInput value={file2} onChange={(v) => uploadPreview2(v)} />
        </Stack>
        <Box className="bg-gray-300">
          {img2 && (
            <ButtonBase
              onClick={() => {
                window.open(Config.BASE_URL + "/uploads/" + img2, "_blank");
              }}
            >
              <Image
                className="mt-5"
                width={200}
                height={200}
                src={Config.BASE_URL + "/uploads/" + img2}
                alt="img"
              />
            </ButtonBase>
          )}
        </Box>
        {img2 && (
          <Box>
            <ButtonBase
              onClick={() => {
                setImg2("");
                setfile2(null);
              }}
            >
              <Typography color="primary">삭제</Typography>
            </ButtonBase>
          </Box>
        )}
        <Stack direction={"row"} className="justify-between">
          <Box className="mt-3">
            <Button variant="contained" onClick={() => createFeed()}>
              피드 사진 추가
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
                <TableCell>사진</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedList.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    <ButtonBase
                      onClick={() =>
                        window.open(
                          Config.BASE_URL + "/uploads/" + item.uri,
                          "_blank"
                        )
                      }
                    >
                      <Image
                        alt="avatar"
                        width={200}
                        height={200}
                        src={Config.BASE_URL + "/uploads/" + item.uri}
                      />
                    </ButtonBase>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeFeed(item.id)}
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
