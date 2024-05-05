import { scrollDownUntilElementPresent } from '../../helpers/utils/uiUtils.js'

class Products {
    constructor () {
        this.locators = {
            productCard: function (productTitle) {
                return driver.isIOS ? `//XCUIElementTypeStaticText[@name="${productTitle}"]/..`
                    : `//android.widget.ImageView[@content-desc="${productTitle}"]/..`
            },
            title: driver.isIOS ? './XCUIElementTypeStaticText[1]' : './/android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/titleTV"]',
            price: driver.isIOS ? './XCUIElementTypeStaticText[2]' : './/android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/priceTV"]'
        }
    }

    productCard = async function (productTitle) {
        this.currentCard = await scrollDownUntilElementPresent(this.locators.productCard(productTitle))
        return this.currentCard
    }

    getTitle = async function () {
        if (this.currentCard) {
            return await (await this.currentCard.$(this.locators.title)).getText()
        }
        else {
            throw new Error('Current card element not defined, call productCard function first')
        }
    }

    getPrice = async function () {
        if (this.currentCard) {
            return parseFloat((await (await this.currentCard.$(this.locators.price)).getText()).replace('$ ', ''))
        } else {
            throw new Error('Current card element not defined, call productCard function first')
        }
    }
}

export default new Products()
