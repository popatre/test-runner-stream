import { tap } from "node:test/reporters";
import { run } from "node:test";
import parseReport, { Report } from "node-test-parser";

import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";

export async function GET() {
    const stream: any = run({
        files: [`${__dirname}/../../../../../src/__tests__/index.test.ts`],
    });

    const report = await parseReport(stream);
    console.log(report, "**************");

    return NextResponse.json({ report });
}
