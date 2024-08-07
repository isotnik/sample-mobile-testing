import welcomePage from '../../pageObjects/nextcloud/Welcome.js'
import loginPage from '../../pageObjects/nextcloud/Login.js'
import filesPage from '../../pageObjects/nextcloud/Files.js'
import { permissionDeny, waitForPermissionDialog } from '../../helpers/utils/systemDialogs.js'
import {
    isElementPresent,
    scrollDownUntilElementPresent,
    scrollUntilElementInViewport
} from '../../helpers/utils/uiUtils.js'
import {isCurrentServiceBrowserStack, reinstallApp} from '../../helpers/utils/testUtils.js'
import {debugLog} from "../../helpers/utils/logUtils.js";

describe('Nextcloud: login', function () {
    const packageId =  driver.options.capabilities["appium:bundleId"]

    before(async function () {
        // reinstall app manually since sometimes apps data isn't cleared on Android
        if (driver.isAndroid && !isCurrentServiceBrowserStack()) {
            await reinstallApp()
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
        // safari toolbar is interfering click on element
        if (driver.isIOS && (await driver.queryAppState('com.apple.mobilesafari')) === 4) {
            await scrollUntilElementInViewport(await loginPage.alternateLoginButton, '', '//XCUIElementTypeOther[@name="CapsuleViewController"]/XCUIElementTypeOther[1]')
        }
        await loginPage.alternateLoginButton.click()
        await scrollDownUntilElementPresent(loginPage.locators.grantAccessButton)
        debugLog('current context:',await driver.getContext())
        debugLog('contexts:',await driver.getContexts())
        await expect(loginPage.alternateLoginUsernameInput).toBePresent()
        await (await loginPage.alternateLoginUsernameInput).setValue(process.env.NC_USERNAME)
        await (await loginPage.alternateLoginTokenInput).setValue(process.env.NC_TOKEN)
        await expect(loginPage.grantAccessButton).toBePresent()
        await loginPage.grantAccessButton.click()
        // handle 'Save password?' Safari dialog
        const safariNotNowButton = '//XCUIElementTypeButton[@name="Not Now"]'
        if (driver.isIOS && await isElementPresent(safariNotNowButton))  {
            await $(safariNotNowButton).click()
        }
        // sometimes login process executed in browser
        if ((driver.isAndroid && (await driver.getCurrentPackage()).includes('chrome')) ||
            (driver.isIOS && (await driver.queryAppState('com.apple.mobilesafari')) === 4)) {
            await expect (loginPage.accountConnectedText).toBePresent()
            await driver.background(null)
            await driver.pause(1500) // inserting delay to avoid strange behaviour
            await driver.activateApp(packageId)
        }
        await loginPage.waitForLoadingSpinner()
        if (driver.isAndroid) {
            // wait until app is really authenticated and notification permission dialog is shown
            await waitForPermissionDialog(10000)
            await permissionDeny()
            await expect(filesPage.storagePermissionsPopupText).toBePresent()
            await filesPage.storagePermissionsCancelButton.click()
        }
        await expect(filesPage.uploadButton).toBePresent()
    })
})