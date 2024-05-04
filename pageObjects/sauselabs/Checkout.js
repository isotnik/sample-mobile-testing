class Checkout {
    constructor() {
        this.locators = {
            fullNameInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Full Name*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/nameET"]',
            cardNumberInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Card Number*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/cardNumberET"]',
            expirationDateInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Expiration Date*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/expirationDateET"]',
            securityCodeInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Security Code*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/securityCodeET"]',
            reviewOrderButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Review Order"]' : '~Saves payment info and launches screen to review checkout data'
        }
    }

    get fullNameInput () {
        return $(this.locators.fullNameInput)
    }

    get cardNumberInput () {
        return $(this.locators.cardNumberInput)
    }

    get expirationDateInput () {
        return $(this.locators.expirationDateInput)
    }

    get securityCodeInput () {
        return $(this.locators.securityCodeInput)
    }

    get reviewOrderButton () {
        return $(this.locators.reviewOrderButton)
    }
}

export default new Checkout()