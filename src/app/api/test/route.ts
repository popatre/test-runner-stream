import { tap } from "node:test/reporters";
import { run } from "node:test";
import parseReport, { Report } from "node-test-parser";

import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";

type ResponseData = { report: Report };

export async function GET(
    req: NextRequest,
    res: NextApiResponse<ResponseData>
) {
    const stream: any = run({
        files: [`${__dirname}/../../../../../src/__tests__/index.test.ts`],
    });

    const report = await parseReport(stream);

    return NextResponse.json({ report });
}
