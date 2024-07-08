class AndroidFileBrowser {
    constructor() {
        this.locators = {
            fileItems: '//android.widget.LinearLayout[@resource-id="com.nextcloud.client:id/ListItemLayout"]',
            fileItemName: function (fileName) {
                return `//android.widget.TextView[@resource-id="com.nextcloud.client:id/Filename" and @text="${fileName}"]`
            },
            fileItemCheckBox: function (fileName) {
                return `//android.widget.TextView[@resource-id="com.nextcloud.client:id/Filename" and @text="${fileName}"]/../..//android.widget.ImageView[@content-desc="Checkbox"]`
            },
            uploadButton: '//android.widget.Button[@resource-id="com.nextcloud.client:id/upload_files_btn_upload"]'
        }
    }

    get fileItems () {
        return $(this.locators.fileItems)
    }

    get uploadButton () {
        return $(this.locators.uploadButton)
    }

    async fileItemName (fileName) {
        return $(this.locators.fileItemName(fileName))
    }

    async fileItemCheckbox (fileName) {
        return $(this.locators.fileItemCheckBox(fileName))
    }
}

export default new AndroidFileBrowser()