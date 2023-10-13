import { tap } from "node:test/reporters";
import { run } from "node:test";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const stream: any = run({
        files: [`${__dirname}/../../../../../src/__tests__/index.test.ts`],
    }).compose(tap);

    // return new StreamingTextResponse(stream);

    // return new StreamingTextResponse(stream, {
    //     headers: { "Content-type": "text/html" },
    // });
    return new NextResponse(stream);
}
