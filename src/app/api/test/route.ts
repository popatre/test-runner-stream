import { tap } from "node:test/reporters";
import { run } from "node:test";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { pipeline } from "stream";
import { StreamingTextResponse, streamToResponse } from "ai";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const stream: any = run({
        files: [`${__dirname}/../../../../../src/__tests__/index.test.ts`],
    }).compose(tap);

    // return new StreamingTextResponse(stream);

    // return new StreamingTextResponse(stream, {
    //     headers: { "Content-type": "text/html" },
    // });
    return new NextResponse(stream);
}
