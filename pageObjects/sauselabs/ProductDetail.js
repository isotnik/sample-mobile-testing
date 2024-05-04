class ProductDetail {
    constructor () {
        this.locator = {
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
        return await $(this.locator.productTitle(productTitle))
    }

    get addToCartButton () {
        return $(this.locator.addToCartButton)
    }

    get productDescription  () {
        return $(this.locator.productDescription)
    }

    get productPrice () {
        return $(this.locator.productPrice)
    }

    goBack = async function () {
        if (driver.isIOS) {
            await (await $(this.locator.backButton)).click()
        } else {
            driver.back()
        }
    }
}

export default new ProductDetail()