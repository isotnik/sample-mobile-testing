import axios from "axios"
import fs from "fs"
import path from 'path'

/**
 * @param {string} nextcloudPath
 * @param {string} localPath
 * @param {string} nextcloudHost
 * @param {string} username
 * @param {string} token
 */
async function getFile(nextcloudPath, localPath, nextcloudHost = process.env.NC_HOST, username = process.env.NC_USERNAME, token = process.env.NC_TOKEN) {
    const url = `https://${nextcloudHost}/remote.php/dav/files/${username}/${nextcloudPath}`
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    const writer = fs.createWriteStream(path.resolve(localPath))
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    })
}

async function deleteFile(nextcloudPath, nextcloudHost = process.env.NC_HOST, username = process.env.NC_USERNAME, token = process.env.NC_TOKEN){
    const url = `https://${nextcloudHost}/remote.php/dav/files/${username}/${nextcloudPath}`
    await axios({
        method: 'DELETE',
        url: url,
        responseType: 'text',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
}

export { getFile, deleteFile }