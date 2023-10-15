import { exec } from "child_process";

export async function runShellCommand(
    cmd: string
): Promise<{ stdout: string; stderr: string }> {
    return new Promise(function (resolve, reject) {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                // console.log(stdout);
                resolve({ stdout, stderr });
            }
        });
    });
}
