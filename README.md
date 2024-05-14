# sample-mobile-testing
This is demo project showing my current skill set in mobile test automation.
Used WebdriverIO and Appium which allows to cover both Android and iOS platforms using the same set of tests.

Currently, **Saucelabs My Demo App** ([Android](https://github.com/saucelabs/my-demo-app-android) and [iOS](https://github.com/saucelabs/my-demo-app-ios)) is used as subject for automation, it allows to show main concepts and approaches. I don't work for Saucelabs company, this is just for demo purposes since this app is open sourced and has versions for Android and iOS.
Also **Nexcloud** ([Android](https://github.com/nextcloud/android) and [iOS](https://github.com/nextcloud/ios)) is used an example since it open sourced, and you can set up you own server on any machine (e.g. in Digital Ocean).

## Usage
1. Clone repo on you local machine
2. Run `npm install`
3. Use `ios_caps_example.json` and `android_caps_example.json` in order to create your own config with desired capabilities. Pay attention to emulator/simulator name, OS version and path to your built app (it has to be absolute)
4. In general json with capabilities config should be named `${appName}_${platformName}_caps.json` or `${appName}bs_${platformName}_caps.json` for BrowserStack
5. You need to spinup you Android emulator manually, `utils/scripts/runAndroidEmulator.sh` can be executed in order to run first emulator in your list of emulators. You can specify environment variable `deviceName` in order to run specific emulator.
6. In terminal execute `npm run ios:${appName}` or `npm run android:{appName}`
7. After test run you can see test results in terminal, also you can see html test report in `reports/html-reports`, screenshots will be included in case of failures.
8. WebdriverIO log can be found at `reports/${platformName}/wdio.log`, Appium log can be found at `reports/os/appium.log`

### Nextcloud tests nuances
On Android you need to build you custom version with the next modification in `app/src/main/AndroidManifest.xml`:
```
<activity
android:name="com.nextcloud.client.onboarding.FirstRunActivity"
android:configChanges="orientation|screenSize"
android:exported="false"
android:theme="@style/Theme.ownCloud.noActionBar.Login" />
```
`exported` needs to be changed to `true`. Reason is that this is first activity which is executed on app start and this is not default one which is expected by Appium. That's why you need to set it to exported, also you need to add this to your capabilities:
`"appium:appActivity": "com.nextcloud.client.onboarding.FirstRunActivity",` (but not needed for BrowserStack)
So Appium will expect this and won't fail.
iOS app can just be built normally for simulator.
Nextcloud tests use the next env variables, so you need to set them before run (via `.env` file, for example):
`NC_HOST` - hostname for your nextcloud instance
`NC_USERNAME` - username for your test user
`NC_TOKEN` - app token for your test user (this is not a password).
Login/password flow isn't automated yet since it behaves very strange and unstable on Android.


## Hints
You can run Appium standalone on default port by executing `npm run appium` in order to connect to your emulator/simulator using Appium Inspector or for any other purposes. Tests still can be run in usual way but invoking appium service will fail (since port is already used) which actually won't affect test run.
You can check your code style errors by executing eslint using the next command `npm run linter`
You can specify environment variables in `.env` file using `ENV_VARIABLE=value` syntax. Those variable will be injected once WebdriverIO starts.
You can tests on BrowserStack using the next command template: `npm run ${platform}:bs:${appname}` (e.g. `npm run android:bs:nextcloud`)


## Project structure
### tests
`tests/${appName}` - keep tests for specific app inside its directory
### pageObjects
`pageObjects/${appName}` - keep page object for specific app inside its directory
### helpers
`helpers/utils` - utils set with common action wrappers for usage in page objects and tests
`helpers/scripts` - shell scripts