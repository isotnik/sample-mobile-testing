import {permissionDeny, waitForPermissionDialog} from "../utils/systemDialogs.js"
import welcomePage from "../../pageObjects/nextcloud/Welcome.js"
import loginPage from "../../pageObjects/nextcloud/Login.js"
import {isElementPresent, scrollDownUntilElementPresent, scrollUntilElementInViewport} from "../utils/uiUtils.js"
import filesPage from "../../pageObjects/nextcloud/Files.js"
import {waitForElementToBePresent} from "../utils/waitUtils.js";

/**
 * Performs login for nextcloud app
 * @param {string} username - username for current user
 * @param {string} token - token (not password) for current user
 */
async function login (username, token) {
    const packageId =  driver.options.capabilities["appium:bundleId"]
    if (driver.isIOS) {
        await permissionDeny()
    }
    await (await waitForElementToBePresent(await welcomePage.loginButton)).click()
    // there is bug on Android: after clicking login button app goes to background
    if (driver.isAndroid && await driver.getCurrentPackage() !== packageId) {
        await driver.activateApp(packageId)
        await welcomePage.loginButton.click()
    }
    await (await waitForElementToBePresent(await loginPage.serverAddressInput)).setValue(process.env.NC_HOST)
    await loginPage.confirmButton.click()
    await loginPage.waitForLoadingSpinner()
    await scrollDownUntilElementPresent(loginPage.locators.alternateLoginButton)
    // safari toolbar is interfering click on element
    if (driver.isIOS && (await driver.queryAppState('com.apple.mobilesafari')) === 4) {
        await scrollUntilElementInViewport(await loginPage.alternateLoginButton, '', '//XCUIElementTypeOther[@name="CapsuleViewController"]/XCUIElementTypeOther[1]')
    }
    await loginPage.alternateLoginButton.click()
    await scrollDownUntilElementPresent(loginPage.locators.grantAccessButton)
    await (await waitForElementToBePresent(await loginPage.alternateLoginUsernameInput)).setValue(username)
    await (await loginPage.alternateLoginTokenInput).setValue(token)
    await loginPage.grantAccessButton.click()
    // handle 'Save password?' Safari dialog
    const safariNotNowButton = '//XCUIElementTypeButton[@name="Not Now"]'
    if (driver.isIOS && await isElementPresent(safariNotNowButton))  {
        await $(safariNotNowButton).click()
    }
    await loginPage.waitForLoadingSpinner()
    // sometimes login process executed in browser
    if ((driver.isAndroid && (await driver.getCurrentPackage()).includes('chrome')) ||
        (driver.isIOS && (await driver.queryAppState('com.apple.mobilesafari')) === 4)) {
        await waitForElementToBePresent(await loginPage.accountConnectedText)
        await driver.background(null)
        await driver.pause(1000) // inserting delay to avoid strange behaviour
        await driver.activateApp(packageId)
    }
    if (driver.isAndroid) {
        // wait until app is really authenticated and notification permission dialog is shown
        await waitForPermissionDialog(10000)
        await permissionDeny()
        await waitForElementToBePresent(await filesPage.storagePermissionsPopupText)
        await filesPage.storagePermissionsCancelButton.click()
    }
    await waitForElementToBePresent(await filesPage.uploadButton)
}

export { login }