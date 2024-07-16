import filesPage from '../../pageObjects/nextcloud/Files.js'
import androidFilesPermissionSystemWindow from '../../pageObjects/nextcloud/AndroidFilesPermissionSystemWindow.js'
import androidFileBrowser from '../../pageObjects/nextcloud/AndroidFileBrowser.js'
import iosFileBrowser from '../../pageObjects/system/IosFileBrowser.js'
import { isCurrentServiceBrowserStack, reinstallApp } from '../../helpers/utils/testUtils.js'
import { login } from '../../helpers/appActions/nexcloud.js'
import { uploadFile } from "../../helpers/utils/mobileFileUtils.js"
import { deleteFile, getFile } from "../../helpers/utils/nextcloudAPI.js"
import { calculateChecksum } from "../../helpers/utils/dataUtils.js"
import { debugLog } from "../../helpers/utils/logUtils.js"
import { testData } from "../../testData/nextcloud/uploadFile.js"

describe ('Nextcloud: upload file', function () {
    const { appName, fileToUpload, folderToCreate, deviceFolder, confirmFolderDeleteMessage } = testData
    const uploadFilePath = `testData/${appName.toLowerCase()}/${fileToUpload}`
    const tmpFilePath = `tmp/${fileToUpload}`

    before('Login and upload file to device', async function() {
        // reinstall app manually since sometimes apps data isn't cleared on Android emulator
        if (driver.isAndroid && !isCurrentServiceBrowserStack()) {
            await reinstallApp()
        }
        await login(process.env.NC_USERNAME, process.env.NC_TOKEN)
        if (driver.isAndroid && isCurrentServiceBrowserStack()) {
            // ensure phone's position is "neutral", it's important for BrowserStack
            await driver.rotateDevice(0, 0, 0)
        }
        await uploadFile(uploadFilePath)
    })

    it('Upload file and delete', async function() {
        await filesPage.uploadButton.click()
        await expect(filesPage.createFolderButton).toBePresent()
        await filesPage.createFolderButton.click()
        await expect(filesPage.createFolderPopupInput).toBePresent()
        await filesPage.createFolderPopupInput.setValue(folderToCreate)
        await filesPage.createFolderPopupConfirmButton.click()
        await expect(filesPage.folderName).toHaveText(folderToCreate)
        await filesPage.uploadButton.click()
        await filesPage.uploadFilesButton.click()
        if (driver.isAndroid) {
            await filesPage.storagePermissionsFullAccessButton.click()
            await expect(androidFilesPermissionSystemWindow.allowAccessToggle).toBePresent()
            await androidFilesPermissionSystemWindow.allowAccessToggle.click()
            await androidFilesPermissionSystemWindow.backButton.click()
            await expect(androidFileBrowser.fileItems).toBePresent()
            await (await androidFileBrowser.fileItemName(deviceFolder)).click()
            await (await androidFileBrowser.fileItemCheckbox(fileToUpload)).click()
            await androidFileBrowser.uploadButton.click()
        } else {
            expect(await iosFileBrowser.getCurrentFolderName()).toBe(appName)
            await (await iosFileBrowser.fileItem(fileToUpload)).click()
            await iosFileBrowser.openButton.click()
        }
        await expect(filesPage.fileItemName(fileToUpload)).toBePresent()
        await filesPage.backButton.click()
        // download file using webdav
        await getFile(`${folderToCreate}/${fileToUpload}`, tmpFilePath)
        await expect(filesPage.fileItemName(folderToCreate)).toBePresent()
        await (await filesPage.fileItemMenuButton(folderToCreate)).click()
        await expect(filesPage.fileItemMenuDelete).toBePresent()
        await filesPage.fileItemMenuDelete.click()
        await expect(filesPage.confirmDialogMessage).toHaveText(expect.stringContaining(confirmFolderDeleteMessage))
        await filesPage.confirmDialogDeleteButton.click()
        await expect(filesPage.fileItemName(folderToCreate)).not.toBePresent()
        await expect(calculateChecksum(uploadFilePath)).toEqual(calculateChecksum(tmpFilePath))
    })

    after('cleanup', async function () {
        try {
            // delete file using webdav
            await deleteFile(folderToCreate)
            console.error('Folder wasn\'t deleted during test run, cleaned up')
        } catch (error) {
            debugLog('Folder was already deleted during test run')
        }
    })
})