import {debugLog} from "../../helpers/utils/logUtils.js";
import {isCurrentServiceBrowserStack} from "../../helpers/utils/testUtils.js"

class Login {
    constructor() {
        this.locators = {
            serverAddressInput: driver.isIOS ? '//XCUIElementTypeTextField[@value="Server address https:// …"]' : '//android.widget.EditText[@resource-id="com.nextcloud.client:id/host_url_input"]',
            confirmButton: driver.isIOS ? '//XCUIElementTypeStaticText[@name="The link to your Nextcloud web interface when you open it in the browser."]/preceding-sibling::XCUIElementTypeButton' : '//android.widget.ImageButton[@content-desc="Test server connection"]',
            confirmLoginButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Log in"]' : '//android.widget.Button[@text="Log in"]',
            usernameInput: driver.isIOS ? '//XCUIElementTypeTextField[@name="Login with username or email"]' : '//android.widget.EditText[@resource-id="user"]',
            passwordInput: driver.isIOS ? '//XCUIElementTypeSecureTextField[@name="Password"]' : '//android.widget.EditText[@resource-id="password"]',
            loginButton: driver.isIOS ? '~Log in' : '//android.widget.Button[@text="Log in"]',
            grantAccessButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Grant access"]' : '//android.widget.Button[@text="Grant access"]',
            loadingSpinner: driver.isIOS ? '//XCUIElementTypeActivityIndicator': '//android.view.View[@resource-id="submit-wrapper"]/android.widget.Button',
            accountConnectedText: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Account connected"]' : '//android.widget.TextView[@text="Account connected"]',
            alternateLoginButton: driver.isIOS ? '//XCUIElementTypeLink[@name="Alternative log in using app token"]'
                : '//android.widget.TextView[@text="Alternative log in using app token"]',
            alternateLoginUsernameInput: driver.isIOS ? '//XCUIElementTypeTextField[@name="Username"]'
                : isCurrentServiceBrowserStack() ? '//android.widget.EditText[@resource-id="user"]' : '//android.widget.Button[@text="Grant access"]/preceding-sibling::android.view.View/preceding-sibling::android.view.View/android.widget.EditText',
            alternateLoginTokenInput: driver.isIOS ? '//XCUIElementTypeSecureTextField[@name="Password"]'
                : isCurrentServiceBrowserStack() ? '//android.widget.EditText[@resource-id="password"]' :'//android.widget.Button[@text="Grant access"]/preceding-sibling::android.view.View[2]/android.widget.EditText'
        }
    }

    get serverAddressInput () {
        return $(this.locators.serverAddressInput)
    }

    get confirmButton () {
        return $(this.locators.confirmButton)
    }

    get confirmLoginButton () {
        return $(this.locators.confirmLoginButton)
    }

    get usernameInput () {
        return $(this.locators.usernameInput)
    }

    get passwordInput () {
        return $(this.locators.passwordInput)
    }

    get loginButton () {
        return $(this.locators.loginButton)
    }

    get grantAccessButton () {
        return $(this.locators.grantAccessButton)
    }

    get accountConnectedText () {
        return $(this.locators.accountConnectedText)
    }

    get alternateLoginButton () {
        return $(this.locators.alternateLoginButton)
    }

    get alternateLoginUsernameInput () {
        return $(this.locators.alternateLoginUsernameInput)
    }

    get alternateLoginTokenInput () {
        return $(this.locators.alternateLoginTokenInput)
    }

    /**
     * Waits until loading spinner is shown and hidden.
     * Implemented only for iOS to avoid situations when element cannot receive click because of spinner on top of it.
     */
    async waitForLoadingSpinner() {
        if (driver.isIOS) {
            const activityIndicator = '//XCUIElementTypeActivityIndicator'
            try {
                await driver.waitUntil(async function () {
                    return await (await $(activityIndicator)).isDisplayed()
                }, {timeout: 2000})
            } catch (error) {
                debugLog('waitForLoadingSpinner: loading spinner wasn\'t shown at all')
            }
            await driver.waitUntil(async function () {
                return !(await (await $(activityIndicator)).isDisplayed())
            })
        }
    }
}

export default new Login()