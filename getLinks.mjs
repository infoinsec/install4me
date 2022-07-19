import puppeteer from 'puppeteer'
import path from 'path'
const downloadPath = path.resolve('./download')

export default async function chrome() {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://www.google.com/intl/en_us/chrome/')

    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
      let match = /https:\/\/dl.google.com\//
      if (match.test(interceptedRequest.url())) {
        console.log('closing browser')
        browser.close()
        resolve(interceptedRequest.url())
      }
    })

    page
      .waitForSelector('button#js-download-hero')
      .then(() => {
        page.evaluate(() => {
          document.querySelector('button#js-download-hero').click()
        })
      })
  })
}

let link = await chrome()
console.log(link)
