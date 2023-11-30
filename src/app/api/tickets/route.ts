import { NextResponse } from "next/server";
const TICKET_DETAILS = require("../../../constants/ticketOptions.ts");

export async function GET(request: Request) {
    return NextResponse.json({ status: 200, tickets: TICKET_DETAILS });
}
//https://github.com/popatre/nc_news
