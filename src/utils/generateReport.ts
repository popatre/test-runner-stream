import parseReport from "node-test-parser";
import { run } from "node:test";

export default async function generateReport(
    testPath: string,
    testName?: string | undefined
) {
    const testPattern = testName ? new RegExp(testName) : undefined;
    console.log(testPattern);
    const stream: any = run({
        files: [testPath],
        testNamePatterns: testPattern,
    });

    const report = await parseReport(stream);

    return report;
}
