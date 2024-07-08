import { debugLog } from "./logUtils.js";

/**
 * Denies a permission request on a mobile device. This function handles different logic based on the device's OS:
 * - For iOS, it dismisses the alert that is presumably a permission request dialog.
 * - For Android, it waits for the permission dialog to be displayed, and then clicks the 'Deny' button.
 * This function assumes that the permission dialog is already prompted or will be prompted shortly (3 secs)
 * @returns {Promise<void>} A promise that resolves after the permission has been denied or the alert has been dismissed                          depending on the device OS. The promise resolves immediately on iOS, as `dismissAlert` does not return a promise.
 */
async function permissionDeny() {
    if (driver.isIOS) {
        await waitForPermissionDialog(3000)
        await driver.dismissAlert()
    } else {
        await waitForPermissionDialog(3000)
        await $('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_deny_button"]').click()
    }
}

/**
 * Waits for the Android or iOS permission dialog to appear within a specified timeout.
 * @param {number} [timeout=3000] - Optional. The maximum amount of time (in milliseconds) to wait for the permission dialog to appear.
 *                                  If not specified, a default timeout of 3000 milliseconds is used.
 * @returns {Promise<void>} A promise that resolves when the permission dialog is displayed or rejects if the timeout is reached.
 */
async function waitForPermissionDialog(timeout) {
    const options = {timeout: typeof timeout === 'number' ? timeout : 3000}
    if (driver.isAndroid) {
        await driver.waitUntil(async function () {
            return await (await $('//android.widget.LinearLayout[@resource-id="com.android.permissioncontroller:id/content_container"]')).isDisplayed()
        }, options)
    } else {
        await driver.waitUntil(async function () {
            try {
                const alertText = await driver.getAlertText();
                debugLog(`waitForPermissionDialog: Alert shown with text: ${alertText}`)
                return true
            } catch (error) {
                return false
            }
        }, options)
    }
}

export { waitForPermissionDialog, permissionDeny }