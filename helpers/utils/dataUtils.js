import fs from 'fs'

/**
 * Reads and parses JSON data from a file synchronously.
 * @param {string} path - The path to the JSON file to read.
 * @returns {Object} Parsed JSON object.
 */
const readJson = function (path) {
    return JSON.parse(fs.readFileSync(path))
}

export { readJson }