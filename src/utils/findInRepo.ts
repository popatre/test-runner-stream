import { runShellCommand } from "./runShellCommand";

export default async function findInRepo(
    stringToFind: string,
    filePath: string
) {
    const shellCommand = `grep -rnw ${filePath} -e ${stringToFind}`;
    try {
        const { stdout } = await runShellCommand(shellCommand);
        return stdout;
    } catch (error) {
        console.log(error);
    }
}
