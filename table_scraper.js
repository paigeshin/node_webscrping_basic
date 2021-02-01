const request = require('request-promise')
const fs = require('fs')
const cheeio = require('cheerio')

async function main() {
    const result = await request.get('https://codingwithstefan.com/table-example')
    const $ = cheeio.load(result)
    const scrapedRows = []
    $("body > table > tbody > tr").each((index, element) => {
        if(index === 0) return   //tr[0]은 td가 아니라 th이므로 생략하도록 한다.
        const tds = $(element).find("td")
        const company = $(tds[0]).text()
        const contact = $(tds[1]).text()
        const country = $(tds[2]).text() //this makes `key-value`, like `country: value` 
        const scrapedRow = { company, contact, country }
        scrapedRows.push(scrapedRow)
    })
    console.log(scrapedRows)
    fs.writeFileSync("scraped.json", JSON.stringify(scrapedRows))
}

main()