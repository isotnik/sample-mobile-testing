import path from "path"
import fs from "fs"

/**
 * Uploads a file to a mobile device (Android or iOS). For iOS uploads inside current app folder, for Android - just into Download folder.
 *
 * @param {string} filePath - The path to the file to be uploaded. If the path is relative, it will be resolved to an absolute path.
 * @throws Will throw an error if the file upload fails.
 *
 * @example
 * // Upload a file to the mobile device
 * await uploadFile('/path/to/file.pdf');
 *
 * @example
 * // Upload a file using a relative path
 * await uploadFile('relative/path/to/file.pdf');
 */
async function uploadFile (filePath) {
    const packageId =  driver.options.capabilities["appium:bundleId"]
    if (!filePath.startsWith('/')) {
        filePath = path.resolve(filePath)
    }
    const fileName = path.basename(filePath)
    const destination = driver.isIOS ? `@${packageId}:data/Documents/${fileName}` : `/sdcard/download/${fileName}`
    await driver.pushFile(
        destination,
        fs.readFileSync(filePath).toString('base64'))
}

export { uploadFile }