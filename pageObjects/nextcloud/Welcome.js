class Welcome {
    constructor() {
        this.locators = {
            loginButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Log in"]' : '//android.widget.Button[@resource-id="com.nextcloud.client:id/login"]',
            signUpWithProviderButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Sign up with provider"]' : '//android.widget.Button[@resource-id="com.nextcloud.client:id/signup"]'
        }
    }

    get loginButton () {
        return $(this.locators.loginButton)
    }

    get signUpWithProviderButton () {
        return $(this.locators.signUpWithProviderButton)
    }
}

export default new Welcome()