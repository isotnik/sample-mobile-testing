class CheckoutComplete {
    constructor() {
        this.locators = {
            continueShoppingButton: driver.isIOS ? '//XCUIElementTypeButton[@name="ContinueShopping"]' : '~Tap to open catalog'
        }
    }

    get continueShoppingButton () {
        return $(this.locators.continueShoppingButton)
    }
}

export default new CheckoutComplete()