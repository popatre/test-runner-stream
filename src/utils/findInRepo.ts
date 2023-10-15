import { runShellCommand } from "./runShellCommand";

export default async function findInRepo(
    stringToFind: string,
    filePath: string
) {
    const shellCommand = `grep -rnw ${filePath} -e ${stringToFind} | sed G`;
    try {
        const { stdout } = await runShellCommand(shellCommand);
        return stdout;
    } catch (error) {
        console.log(error);
    }
}
