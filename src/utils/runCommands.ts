import { runShellCommand } from "./runShellCommand";
import fs from "fs";

export async function runCommands(
    repoUrl: string,
    appType: string,
    branch: string,
    working_dir: string
) {
    const gitClone = `git clone -b ${branch} ${repoUrl} ${working_dir}`;

    const setupDbs = `psql -f ${__dirname}/../../../../../src/setup-db/${appType}/setup-test-db.sql`;
    await removeFolder(working_dir);
    await runShellCommand(`${gitClone} && ${setupDbs}`);
}

async function removeFolder(workingDir: string) {
    if (fs.existsSync(workingDir)) {
        return await runShellCommand(`rm -r ${workingDir}`);
    } else {
        return;
    }
}
