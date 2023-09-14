import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Issawara Kongsricharoen",
    studentId: "650610821",
  });
};
