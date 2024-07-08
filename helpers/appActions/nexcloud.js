import {permissionDeny, waitForPermissionDialog} from "../utils/systemDialogs.js"
import welcomePage from "../../pageObjects/nextcloud/Welcome.js"
import loginPage from "../../pageObjects/nextcloud/Login.js"
import {isElementPresent, scrollDownUntilElementPresent, scrollUntilElementInViewport} from "../utils/uiUtils.js"
import filesPage from "../../pageObjects/nextcloud/Files.js"

async function login (username, token) {
    const packageId =  driver.options.capabilities["appium:bundleId"]
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
    await expect(loginPage.alternateLoginUsernameInput).toBePresent()
    await (await loginPage.alternateLoginUsernameInput).setValue(username)
    await (await loginPage.alternateLoginTokenInput).setValue(token)
    await expect(loginPage.grantAccessButton).toBePresent()
    await loginPage.grantAccessButton.click()
    if (driver.isIOS && isElementPresent('//XCUIElementTypeButton[@name="Not Now"]'))  {
        await $('//XCUIElementTypeButton[@name="Not Now"]').click()
    }
    await loginPage.waitForLoadingSpinner()
    // sometimes login process executed in browser
    if ((driver.isAndroid && (await driver.getCurrentPackage()).includes('chrome')) ||
        (driver.isIOS && (await driver.queryAppState('com.apple.mobilesafari')) === 4)) {
        await expect (loginPage.accountConnectedText).toBePresent()
        await driver.background(null)
        await driver.pause(1500) // inserting delay to avoid strange behaviour
        await driver.activateApp(packageId)
    }
    if (driver.isAndroid) {
        // wait until app is really authenticated and notification permission dialog is shown
        await waitForPermissionDialog(10000)
        await permissionDeny()
        await expect(filesPage.storagePermissionsPopupText).toBePresent()
        await filesPage.storagePermissionsCancelButton.click()
    }
    await expect(filesPage.uploadButton).toBePresent()
}

export { login }