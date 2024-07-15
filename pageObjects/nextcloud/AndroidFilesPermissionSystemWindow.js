import {currentDeviceName} from "../../helpers/utils/testUtils.js";

class AndroidFilesPermissionSystemWindow {
    constructor() {
        this.locators = {
            allowAccessToggle: currentDeviceName().includes('Samsung') ? '//android.widget.Switch[@resource-id="android:id/switch_widget"]' : '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.TextView[@text="Nextcloud"]/../../android.view.View[2]/android.view.View',
            backButton:  currentDeviceName().includes('Samsung') ? '//android.widget.ImageButton[@content-desc="Navigate up"]' : '//android.view.View[@content-desc="Navigate up"]/following-sibling::android.widget.Button'
        }
    }

    get allowAccessToggle() {
        return $(this.locators.allowAccessToggle)
    }

    get backButton() {
        return $(this.locators.backButton)
    }
}

export default new AndroidFilesPermissionSystemWindow()