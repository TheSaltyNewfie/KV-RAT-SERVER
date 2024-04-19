import * as fs from 'fs';
import * as zlib from 'zlib';

export function storeData(data: string) {
    const decoded = Buffer.from(data, 'base64');
    zlib.unzip(decoded, (err, buffer) => {
        if (err) {
            console.error(err);
            return;
        }
        const filePath = "server-interface/src/assets/screenshot.png";
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("File saved successfully");
        });
    });
}