class ReviewOrder {
    constructor() {
        this.locators = {
            placeOrderButton: driver.isIOS ? '//XCUIElementTypeButton[@name="Place Order"]' : '~Completes the process of checkout'
        }
    }

    get placeOrderButton () {
        return $(this.locators.placeOrderButton)
    }
}

export default new ReviewOrder()