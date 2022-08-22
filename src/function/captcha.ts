import path from 'path';
import fs from 'fs';
import axios from 'axios';

const downloadFile = async function (URL: string, Path: string) {
    const util = require('util');
    const stream = require('stream');
    const pipeline = util.promisify(stream.pipeline);
    const request = await axios.get(URL, {
        responseType: 'stream',
    });
    await pipeline(request.data, fs.createWriteStream(Path));
    return true;
};

function base64_encode(file: string) {
    const bitmap = fs.readFileSync(path.resolve(file));
    const b64_ = Buffer.from(bitmap).toString('base64');
    return b64_;
}

const solveCaptcha = async function (
    url: string,
    username: string,
    apikey: string,
    FolderPath: string
): Promise<{ result: string | undefined } | undefined> {
    if (!username || !apikey || username == '' || apikey == '')
        return undefined;
    const Path = path.resolve(FolderPath, 'captcha.png');
    console.log('DOWNLOADING IMAGE');
    await downloadFile(url, Path);
    const postData = {
        userid: username,
        apikey: apikey,
        data: base64_encode(Path),
    };
    return new Promise(async (resolve, reject) => {
        const response = await axios
            .post('https://api.apitruecaptcha.org/one/gettext', postData)
            .catch(reject);
        if (response) resolve(response.data.result);
    });
};

export { solveCaptcha };
