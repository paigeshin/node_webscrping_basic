
# What you should always check before even writing a web scraping

1. Try to find an API first
2. Second option is **Request** ⇒ You can see a Request Example with the Craigslist scraper and IMDb scraper 
3. Last option is Puppeteer or other automated browsers

Select Multiple Elements

# First Simple Scraper using request & request-promise & cheerio

### First Scraper

```bash
npm i request request-promise cheerio --save
```

⇒ What you need for webscraping 

```jsx
const request = require('request-promise')
const fs = require('fs')
const cheeio = require('cheerio')

async function main() {
    const html = await request.get("https://reactnativetutorial.net/css-selectors/")
    fs.writeFileSync('./test.html', html)
    const $ = await cheeio.load(html)
    const theText = $('h1').text()
    console.log(theText)
}

main()
```

### Select Multiple Elements

```jsx
$("h2").each((index, element) => {

})
```

```jsx
const request = require('request-promise')
const fs = require('fs')
const cheeio = require('cheerio')

async function main() {
    const html = await request.get("https://reactnativetutorial.net/css-selectors/lesson2.html")
    fs.writeFileSync('./test.html', html)
    const $ = await cheeio.load(html)
    const theText = $('h1').text()
    $("h2").each((index, element) => {
        console.log($(element).text())
    })
}

main()
```

### Selecting with HTML attributes

```jsx
$('[data-customer="22293"]').text()
```

# Scrape Table

### First example

```html
<table>
    <tr>
        <th>Company</th>
        <th>Contact</th>
        <th>Country</th>
    </tr>
    <tr>
        <td>kim</td>
        <td>01080133112</td>
        <td>Germany</td>
    </tr>
    <tr>
        <td>lee</td>
        <td>01055884400</td>
        <td>Korea</td>
    </tr>
    <tr>
        <td>park</td>
        <td>01044332266</td>
        <td>Japan</td>
    </tr>
    <tr>
        <td>choi</td>
        <td>01055443378</td>
        <td>England</td>
    </tr>
    <tr>
        <td>shin</td>
        <td>01099559922</td>
        <td>France</td>
    </tr>
</table>
```

```jsx
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
```

### Another Example (avoid hardcoding)

```jsx
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
```