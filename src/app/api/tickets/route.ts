import { NextResponse } from "next/server";
const { tickets } = require("../../../constants/ticketOptions.ts");

export async function GET(request: Request) {
    return NextResponse.json({ status: 200, tickets });
}
