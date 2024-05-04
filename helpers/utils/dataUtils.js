import fs from 'fs'
const readJson = function (path) {

    return JSON.parse(fs.readFileSync(path))
}

export { readJson }