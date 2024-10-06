const { spawn } = require('child_process');

function findMismatchedFiles() {
    return new Promise((resolve, reject) => {
        const grepProcess = spawn('grep', ['sidebar_position', 'docs/tech/algo/leetcode/', '-r']);
        let output = '';
        grepProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        grepProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
        grepProcess.on('close', (code) => {
            if (code === 0) {
                const mismatchedFiles = [];
                const lines = output.split('\n');
                lines.forEach(line => {
                    if (line.trim() !== '') {
                        const parts = line.split(':sidebar_position: ');
                        if (parts.length === 2) {
                            const filePath = parts[0];
                            const sidebarPositionValue = parseInt(parts[1]);
                            const fileNameParts = filePath.split('/').pop().split(' ');
                            const fileNameNumber = parseInt(fileNameParts[0]);
                            if (fileNameNumber !== sidebarPositionValue) {
                                mismatchedFiles.push(filePath);
                            }
                        }
                    }
                });
                resolve(mismatchedFiles);
            } else {
                reject(`Process exited with code ${code}`);
            }
        });
    });
}

findMismatchedFiles().then(files => {
    console.log(files);
}).catch(error => {
    console.error(error);
});
