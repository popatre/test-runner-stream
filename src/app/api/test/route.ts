import { NextResponse } from "next/server";
import generateReport from "@/utils/generateReport";

export async function GET() {
    const path = `${__dirname}/../../../../../src/__tests__/index.test.ts`;

    const report = await generateReport(
        path,
        `GET:/api/articles/:article_id/comments -`
    );

    return NextResponse.json({ report });
}
