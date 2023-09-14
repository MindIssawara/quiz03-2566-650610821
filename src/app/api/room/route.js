import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let sum = 0;
  DB.rooms.map((x) => (sum += 1));
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: sum,
  });
};

export const POST = async (request) => {
  const body = await request.json();
  const { roomName } = body;
  const payload = checkToken();
  if (
    !payload ||
    (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")
  ) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const foundroom = DB.rooms.find((x) => x.roomName === roomName);

  if (foundroom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  DB.rooms.push({
    roomId,
    roomName,
  });
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
