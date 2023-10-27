import { runCommands } from "@/utils/runCommands";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const path = `${__dirname}/../../../../../src/evaluations/student`;
    const { searchParams } = new URL(request.url);
    const repoLink = searchParams.get("repo");
    const branch = searchParams.get("branch");
    const appType = searchParams.get("app");

    await runCommands(repoLink || "", appType || "", branch || "", path);

    return NextResponse.json({ status: 200, msg: "cloned successfully" });
}
//https://github.com/popatre/nc_news
