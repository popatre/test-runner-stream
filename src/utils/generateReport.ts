import parseReport from "node-test-parser";
import { run } from "node:test";

export default async function generateReport(
    testPath: string,
    testName?: string
) {
    const stream: any = run({
        files: [testPath],
    });

    const report = await parseReport(stream);

    return report;
}
