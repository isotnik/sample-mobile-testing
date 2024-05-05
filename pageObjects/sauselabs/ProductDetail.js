class ProductDetail {
    constructor () {
        this.locators = {
            productTitle: function (productTitle) {
                return driver.isIOS ? `~${productTitle}` : 'id=com.saucelabs.mydemoapp.android:id/productTV'
            },
            productPrice: driver.isIOS ? '~Price' : 'id=com.saucelabs.mydemoapp.android:id/priceTV',
            addToCartButton: driver.isIOS ? '~Add To Cart' : '~Tap to add product to cart',
            productDescription: driver.isIOS ? '//XCUIElementTypeTextView' : 'id=com.saucelabs.mydemoapp.android:id/descTV',
            backButton: '//XCUIElementTypeImage[@name="BackButton Icons"]/preceding-sibling::XCUIElementTypeButton'
        }
    }

    productTitle = async function (productTitle) {
        return await $(this.locators.productTitle(productTitle))
    }

    get addToCartButton () {
        return $(this.locators.addToCartButton)
    }

    get productDescription  () {
        return $(this.locators.productDescription)
    }

    get productPrice () {
        return $(this.locators.productPrice)
    }

    goBack = async function () {
        if (driver.isIOS) {
            await (await $(this.locators.backButton)).click()
        } else {
            driver.back()
        }
    }
}

export default new ProductDetail()