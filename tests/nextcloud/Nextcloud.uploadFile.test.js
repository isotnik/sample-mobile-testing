import filesPage from '../../pageObjects/nextcloud/Files.js'
import androidFilesPermissionSystemWindow from '../../pageObjects/nextcloud/AndroidFilesPermissionSystemWindow.js'
import androidFileBrowser from '../../pageObjects/nextcloud/AndroidFileBrowser.js'
import iosFileBrowser from '../../pageObjects/system/IosFileBrowser.js'
import {isCurrentServiceBrowserStack, reinstallApp} from '../../helpers/utils/testUtils.js'
import { login } from '../../helpers/appActions/nexcloud.js'
import { uploadFile } from "../../helpers/utils/mobileFileUtils.js";

describe ('Nextcloud: upload file', function () {
    const fileToUpload = 'Illia Sotnyk CV.pdf'
    const folderToCreate = 'my_docs'
    const deviceFolder = 'Download'
    const confirmFolderDeleteMessage = driver.isIOS ? `You will delete the following:   - ${folderToCreate}`
        : `Do you really want to delete ${folderToCreate} and the contents thereof?`

    before('Upload file to device', async function() {
        // reinstall app manually since sometimes apps data isn't cleared on Android emulator
        if (driver.isAndroid && !isCurrentServiceBrowserStack()) {
            await reinstallApp()
        }
        await login(process.env.NC_USERNAME, process.env.NC_TOKEN)
        await uploadFile(`testData/${fileToUpload}`)
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
            expect(await iosFileBrowser.getCurrentFolderName()).toBe('Nextcloud')
            await (await iosFileBrowser.fileItem(fileToUpload)).click()
            await iosFileBrowser.openButton.click()
        }
        await expect(filesPage.fileItemName(fileToUpload)).toBePresent()
        await filesPage.backButton.click()
        await expect(filesPage.fileItemName(folderToCreate)).toBePresent()
        await (await filesPage.fileItemMenuButton(folderToCreate)).click()
        await expect(filesPage.fileItemMenuDelete).toBePresent()
        await filesPage.fileItemMenuDelete.click()
        await expect(filesPage.confirmDialogMessage).toHaveText(confirmFolderDeleteMessage)
        await filesPage.confirmDialogDeleteButton.click()
        await expect(filesPage.fileItemName(folderToCreate)).not.toBePresent()
    })
})