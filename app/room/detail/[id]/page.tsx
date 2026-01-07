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
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Config } from "@/app/Config";
import Link from "next/link";

interface Params {
  id: string;
}

export default function RoomDetail() {
  const { id } = useParams();
  const [uid, setUid] = useState("");
  const [lot, setLot] = useState("");
  const [ment, setMent] = useState("");
  const [list, setList] = useState([]);

  const [price, setPrice] = useState(0);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  const [cnt, setCnt] = useState(0);

  const mentCache = useRef({});
  const giftCache = useRef({});

  const trimLot = () => {
    let ret = "";
    const lotArr = [];

    lot.split(",").forEach((item, idx) => {
      lotArr.push(Number(item.trim()));
    });
    lotArr.sort((a, b) => a - b);
    lotArr.forEach((item, idx) => {
      ret += item;
      if (idx < lotArr.length - 1) {
        ret += ",";
      }
    });
    return ret;
  };

  const insertLot = async () => {
    if (!uid || !lot || !ment) {
      alert("데이터를 채워주세요.");
    }
    const check = await axios.post(Config.BASE_URL + "/room/check", {
      id: id,
    });
    if (!check) {
      alert("인원수 초과!");
      return;
    }
    const res = await axios.post(Config.BASE_URL + "/lot/create", {
      uid: uid,
      roomid: id,
      lot: trimLot(),
      ment: encodeURIComponent(ment),
    });
    alert(res.data);
    location.reload();
  };

  const deleteLot = async (itemid) => {
    const res = await axios.post(Config.BASE_URL + "/lot/delete", {
      id: itemid,
      roomid: id,
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

  const updateLot = async (id, idx) => {
    const res = await axios.post(Config.BASE_URL + "/lot/update", {
      id: id,
      ment: mentCache.current[idx],
      gift: giftCache.current[idx],
    });
    alert(res.data);
    location.reload();
  };

  const fetchData = async () => {
    const res = await axios.post(Config.BASE_URL + "/lot", {
      roomid: id,
    });

    res.data.forEach((item, idx) => {
      res.data[idx].diff = 0;
    });
    setList(res.data);
    console.log(res.data);
    fetchRoomInfo(res.data);
  };

  const fetchRoomInfo = async (list) => {
    const res = await axios.post(Config.BASE_URL + "/room-by-id", {
      id: id,
    });
    if (res.data) {
      setPrice(res.data.price);
      setCurrent(res.data.current);
      setTotal(res.data.total);
      const date = new Date(res.data.expired);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const exp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      fetchBingo(list, exp);
    }
  };

  const fetchBingo = async (list, exp) => {
    const res = await axios.post(Config.BASE_URL + "/bingo-by-exp", {
      exp: exp,
    });
    if (res.data) {
      console.log(res.data);
      if (res.data.status == 1) {
        sortingByBingo(list, res.data.lot);
      }
    }
  };

  const diffLot = (e1, e2) => {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
      sum += Math.abs(e1[i] - e2[i]);
    }
    return sum;
  };

  const sortingByBingo = (list, lot) => {
    const bingo = lot.split(",");
    bingo.forEach((item, idx) => {
      bingo[idx] = Number(item.trim());
    });
    bingo.sort((a, b) => a - b);

    list.forEach((item, idx) => {
      const split_lot = item.lot.split(",");
      split_lot.forEach((item2, idx2) => {
        split_lot[idx2] = Number(item2.trim());
      });
      list[idx].bingo = split_lot.sort((a, b) => a - b);
      list[idx].diff = diffLot(split_lot, bingo);
    });

    list.sort((a, b) => {
      if (a.diff == b.diff) {
        const date1 = new Date(a.created);
        const date2 = new Date(b.created);
        return date1.getDate() - date2.getDate();
      }
      return a.diff - b.diff;
    });

    list.forEach((item, idx) => {
      if (idx == 0 && item.diff == 0) {
        item.ranking = 0;
      } else {
        item.ranking = idx + 1;
      }
    });

    console.log(bingo);
    console.log(list);
    setList(Array.from(list));
    updateRanking(list);
  };

  const updateRanking = (list) => {
    list.forEach(async (item, idx) => {
      const res = await axios.post(Config.BASE_URL + "/lot/update-ranking", {
        id: item.id,
        ranking: item.ranking,
      });
      if (res.data === "success") {
        setCnt(idx + 1);
      }
    });
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
        <Link href={"/room"}>
          <Typography color="primary">뒤로</Typography>
        </Link>
      </Box>
      <Typography color="primary" fontWeight={900}>
        로또방 보기 {id} / 배팅금 : {price} / 현재원 : {current} / 총원 {total}
      </Typography>
      <Typography color="primary" fontWeight={900}>
        업데이트 랭킹 {cnt}
      </Typography>
      <>
        <Stack direction={"row"} className="flex mt-3 items-center" spacing={5}>
          <Typography color="primary">유저ID</Typography>
          <TextField
            id="userid"
            label="유저ID"
            variant="filled"
            type="text"
            onChange={(e) => setUid(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">로또번호</Typography>
          <TextField
            id="lot"
            label="로또번호"
            variant="filled"
            type="text"
            onChange={(e) => setLot(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="flex mt-1 items-center" spacing={5}>
          <Typography color="primary">멘트</Typography>
          <TextField
            id="ment"
            label="멘트"
            variant="filled"
            type="text"
            onChange={(e) => setMent(e.target.value)}
          />
        </Stack>
        <Stack direction={"row"} className="justify-between">
          <Box className="mt-3">
            <Button variant="contained" onClick={() => insertLot()}>
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
                <TableCell>uid</TableCell>
                <TableCell>rid</TableCell>
                <TableCell>번호</TableCell>
                <TableCell>구매시간</TableCell>
                <TableCell>멘트</TableCell>
                <TableCell>랭킹</TableCell>
                <TableCell>diff</TableCell>
                <TableCell>선물</TableCell>
                <TableCell>수정</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.uid}</TableCell>
                  <TableCell>{item.roomid}</TableCell>
                  <TableCell>{item.lot}</TableCell>
                  <TableCell>{dateToString(item.created)}</TableCell>
                  <TableCell>
                    {decodeURIComponent(item.ment)}
                    <TextField
                      id="ment"
                      label="수정할 멘트"
                      variant="filled"
                      type="text"
                      onChange={(e) =>
                        (mentCache.current[idx] = e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>{item.ranking}</TableCell>
                  <TableCell>{item.diff}</TableCell>
                  <TableCell>
                    {item.gift}
                    <TextField
                      id="gift"
                      label="선물"
                      variant="filled"
                      type="number"
                      onChange={(e) =>
                        (giftCache.current[idx] = e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => updateLot(item.id, idx)}
                    >
                      수정
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteLot(item.id)}
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
