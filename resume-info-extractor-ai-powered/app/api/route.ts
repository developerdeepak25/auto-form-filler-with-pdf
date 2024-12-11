// not usin nextjs api handler now have created a saperate expresss server

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "everyting good" });
}
