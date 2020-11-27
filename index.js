const { detect } = require('detect-browser')

const browser = detect()

const {
  appVersion,
  userAgent,
  vendor,
  languages
} = navigator

if (browser) {
  console.table(browser)
}

console.table({
  appVersion,
  userAgent,
  vendor,
  languages: languages.join(', ')
})
