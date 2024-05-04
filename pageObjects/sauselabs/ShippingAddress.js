class ShippingAddress {
    constructor() {
        this.locators = {
            fullNameInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Full Name*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/fullNameET"]',
            addressLine1Input: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Address Line 1*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/address1ET"]',
            addressLine2Input: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Address Line 2"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/address2ET"]',
            cityInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="City*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/cityET"]',
            stateInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="State/Region"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/stateET"]',
            zipCodeInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Zip Code*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/zipET"]',
            countryInput: driver.isIOS ? '//XCUIElementTypeStaticText[@name="Country*"]/following-sibling::XCUIElementTypeOther[1]/XCUIElementTypeTextField'
                : '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/countryET"]',
            toPaymentButton: driver.isIOS ? '//XCUIElementTypeButton[@name="To Payment"]' : '//android.widget.Button[@content-desc="Saves user info for checkout"]'
        }
    }

    get fullNameInput () {
        return $(this.locators.fullNameInput)
    }

    get addressLine1Input () {
        return $(this.locators.addressLine1Input)
    }

    get addressLine2Input () {
        return $(this.locators.addressLine2Input)
    }

    get cityInput () {
        return $(this.locators.cityInput)
    }

    get stateInput () {
        return $(this.locators.stateInput)
    }

    get zipCodeInput () {
        return $(this.locators.zipCodeInput)
    }

    get countryInput () {
        return $(this.locators.countryInput)
    }

    get toPaymentButton () {
        return $(this.locators.toPaymentButton)
    }
}

export default new ShippingAddress()