import { config as conf } from './wdio.conf.js'

conf.specs = ['./tests/saucelabs/*']
conf.user = process.env.BS_USER
conf.key = process.env.BS_KEY
conf.services = [
    ['browserstack', {
        app: process.env.BS_APP,
        browserstackLocal: true
    }]
]

export const config = { ...conf }
