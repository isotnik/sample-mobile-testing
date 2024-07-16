import fs from 'fs'
import crypto from 'crypto'

/**
 * Reads and parses JSON data from a file synchronously.
 * @param {string} path - The path to the JSON file to read.
 * @returns {Object} Parsed JSON object.
 */
function readJson(path) {
    return JSON.parse(fs.readFileSync(path))
}

/**
 * @param {string | Buffer | URL} filePath
 * @returns {Promise<string>} sha256 has of file
 */
function calculateChecksum(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256')
        const stream = fs.createReadStream(filePath)
        stream.on('data', (data) => hash.update(data))
        stream.on('end', () => resolve(hash.digest('hex')))
        stream.on('error', reject);
    })
}

export { readJson, calculateChecksum }