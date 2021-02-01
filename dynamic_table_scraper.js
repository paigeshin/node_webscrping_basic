const request = require('request-promise')
const fs = require('fs')
const cheeio = require('cheerio')

async function main() {
    const result = await request.get('https://codingwithstefan.com/table-example')
    const $ = cheeio.load(result)
    const scrapedRows = []
    const tableHeaders = []
    $("body > table > tbody > tr").each((index, element) => {
        //index가 0일 때, tableHeaders 어레이를 만든다.
        if (index === 0) {
            const ths = $(element).find("th")
            ths.each((index, element) => {
                tableHeaders.push(
                    $(element)
                        .text()
                        .toLowerCase()
                )
            })
        }
        const tds = $(element).find("td")
        const tableRow = {}
        tds.each((index, element) => {
            tableRow[tableHeaders[index]] = $(element).text()
        })
        scrapedRows.push(tableRow)
    })
    console.log(scrapedRows)
    fs.writeFileSync("scraped.json", JSON.stringify(scrapedRows))
}

main()