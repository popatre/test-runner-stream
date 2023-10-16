import { runCommands } from "@/utils/runCommands";
import { NextResponse } from "next/server";

export async function GET() {
    const path = `${__dirname}/../../../../../src/evaluations/student`;

    await runCommands(
        "student",
        "https://github.com/popatre/nc_news",
        "news",
        "main",
        path
    );

    return NextResponse.json({ status: 200, msg: "cloned successfully" });
}
