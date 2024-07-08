class AndroidFilesPermissionSystemWindow {
    constructor() {
        this.locators = {
            allowAccessToggle: '//android.widget.FrameLayout[@resource-id="android:id/content"]//android.widget.TextView[@text="Nextcloud"]/../../android.view.View[2]/android.view.View',
            backButton: '//android.view.View[@content-desc="Navigate up"]/following-sibling::android.widget.Button'
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