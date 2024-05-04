class Login {
    constructor () {
        this.locators = {
            userameInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="User Name"]/following-sibling::XCUIElementTypeOther/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/nameET"]',
            passwordInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Password"]/following-sibling::XCUIElementTypeOther/XCUIElementTypeSecureTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/passwordET"]',
            loginButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Login"]' : '~Tap to login with given credentials'
        }
    }

    get usernameInput () {
        return $(this.locators.userameInput)
    }

    get passwordInput () {
        return $(this.locators.passwordInput)
    }

    get loginButton () {
        return $(this.locators.loginButton)
    }

    autofillLoginButton = async function  (username) {
        return $(`//XCUIElementTypeButton[@name="${username}"]`)
    }
}
export default new Login()