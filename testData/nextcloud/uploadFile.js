export const testData = {
  appName: 'Nextcloud',
  fileToUpload: 'Illia Sotnyk CV.pdf',
  folderToCreate: 'my_docs',
  deviceFolder: 'Download',
  get confirmFolderDeleteMessage() {
    return driver.isIOS ? `You will delete the following:   - ${this.folderToCreate}`
        : `Do you really want to delete ${this.folderToCreate}`
  }
}