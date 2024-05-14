import welcomePage from '../../pageObjects/nextcloud/Welcome.js'
import loginPage from '../../pageObjects/nextcloud/Login.js'
import mainPage from '../../pageObjects/nextcloud/Main.js'
import { permissionDeny, waitForPermissionDialog } from "../../helpers/utils/systemDialogs.js"
import {scrollDownUntilElementPresent} from "../../helpers/utils/uiUtils.js"
import {isCurrentServiceBrowserStack} from "../../helpers/utils/testUtils.js"

describe('Nextcloud app demo test', function () {
    const packageId =  driver.options.capabilities["appium:bundleId"]
    const appPath = driver.options.capabilities["appium:app"]

    before(async function () {
        if (driver.isAndroid && !isCurrentServiceBrowserStack()) { // reinstall app manually since sometimes apps data wasn't cleared
            await driver.removeApp(packageId)
            await driver.installApp(appPath)
            await driver.activateApp(packageId)
        }
    })

    it('Login', async function () {
        if (driver.isIOS) {
            await permissionDeny()
        }
        await expect(welcomePage.loginButton).toBePresent()
        await welcomePage.loginButton.click()
        // there is bug on Android: after clicking login button app goes to background
        if (driver.isAndroid && await driver.getCurrentPackage() !== packageId) {
            await driver.activateApp(packageId)
            await welcomePage.loginButton.click()
        }
        await expect(loginPage.serverAddressInput).toBePresent()
        await loginPage.serverAddressInput.setValue(process.env.NC_HOST)
        await loginPage.confirmButton.click()
        await loginPage.waitForLoadingSpinner()
        await scrollDownUntilElementPresent(loginPage.locators.alternateLoginButton)
        await expect(loginPage.alternateLoginButton).toBePresent()
        await loginPage.alternateLoginButton.click()
        await scrollDownUntilElementPresent(loginPage.locators.grantAccessButton)
        await expect(loginPage.alternateLoginUsernameInput).toBePresent()
        await (await loginPage.alternateLoginUsernameInput).setValue(process.env.NC_USERNAME)
        await (await loginPage.alternateLoginTokenInput).setValue(process.env.NC_TOKEN)
        await expect(loginPage.grantAccessButton).toBePresent()
        await loginPage.grantAccessButton.click()
        await loginPage.waitForLoadingSpinner()
        // on Android login process might be executed on Chrome browser
        if (driver.isAndroid && (await driver.getCurrentPackage()).includes('chrome')) {
            await expect (loginPage.accountConnectedText).toBePresent()
            await driver.background(null)
            driver.pause(1500) // inserting delay to avoid strange behaviour
            await driver.activateApp(packageId)
        }
        if (driver.isAndroid) {
            // wait until app is really authenticated and notification permission dialog is shown
            await waitForPermissionDialog(10000)
            await permissionDeny()
            await expect(mainPage.storagePermissionsPopupText).toBePresent()
            await mainPage.storagePermissionsCancelButton.click()
        }
        await expect(mainPage.uploadButton).toBePresent()
    })
})