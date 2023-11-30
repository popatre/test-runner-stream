import { NextResponse } from "next/server";
import generateReport from "@/utils/generateReport";

export async function GET(request: Request) {
    const path = `${__dirname}/../../../../../src/__tests__/index.test.ts`;

    const { searchParams } = new URL(request.url);
    const ticket = searchParams.get("ticket");

    const testSearch = ticket === "all" ? null : `${ticket}:`;

    const report = await generateReport(path, testSearch);

    return NextResponse.json({ report });
}
