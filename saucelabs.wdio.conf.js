import { config as conf } from './wdio.conf.js'
conf.specs = ['./tests/saucelabs/*']
export const config = { ...conf }
