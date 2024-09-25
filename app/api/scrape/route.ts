import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import cheerio from 'cheerio'

interface CodeData {
  expiry: string
  content: string
  code: string
  deep_link: string
}

async function scrapeUberEatsCodes(): Promise<CodeData[]> {
  const url = "https://www.callingtaiwan.com.tw/ubereats優惠-最新餐廳外送首購優惠序號-折扣碼-推薦碼/"
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    
    const codes: CodeData[] = []
    
    $('table tr').slice(1).each((_, row) => {
      const cols = $(row).find('td')
      if (cols.length >= 3) {
        const expiry = $(cols[0]).text().trim()
        const content = $(cols[1]).text().trim()
        let code = $(cols[2]).text().trim()
        
        code = code.replace(/\s*\(.*?\)\s*/g, '')
        
        const deep_link = `ubereats://promo/apply?client_id=eats&promoCode=${encodeURIComponent(code)}`
        
        codes.push({ expiry, content, code, deep_link })
      }
    })
    
    console.log(`找到 ${codes.length} 個 UberEats 優惠碼`)
    return codes
  } catch (e) {
    console.error(`爬取 UberEats 優惠碼過程中出現錯誤: ${e}`)
    return []
  }
}

async function scrapeFoodpandaCodes(): Promise<CodeData[]> {
  const url = "https://www.callingtaiwan.com.tw/foodpanda-coupon-code/"
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    
    const codes: CodeData[] = []
    
    $('#coupon_table tr').slice(1).each((_, row) => {
      const cells = $(row).find('td')
      if (cells.length === 3) {
        const expiry = $(cells[0]).text().trim()
        const content = $(cells[1]).text().trim()
        const codeElement = $(cells[2]).find('a.rdc_box_button')
        
        if (codeElement.length && codeElement.attr('data-code')) {
          const code = codeElement.text().trim()
          const deep_link = `foodpanda://coupon?code=${encodeURIComponent(code)}`
          
          codes.push({ expiry, content, code, deep_link })
        }
      }
    })
    
    console.log(`找到 ${codes.length} 個 Foodpanda 優惠碼`)
    return codes
  } catch (e) {
    console.error(`爬取 Foodpanda 優惠碼過程中出現錯誤: ${e}`)
    return []
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const uberEatsCodes = await scrapeUberEatsCodes()
      const foodpandaCodes = await scrapeFoodpandaCodes()

      const categories: { [key: string]: { [key: string]: CodeData[] } } = { "UberEats": {}, "Foodpanda": {} }

      for (const code of uberEatsCodes) {
        const categoryMatch = code.content.match(/【(.*?)】/)
        const category = categoryMatch ? categoryMatch[1] : '其他'
        if (!categories["UberEats"][category]) {
          categories["UberEats"][category] = []
        }
        categories["UberEats"][category].push(code)
      }

      for (const code of foodpandaCodes) {
        const categoryMatch = code.content.match(/【(.*?)】/)
        const category = categoryMatch ? categoryMatch[1] : '其他'
        if (!categories["Foodpanda"][category]) {
          categories["Foodpanda"][category] = []
        }
        categories["Foodpanda"][category].push(code)
      }

      res.status(200).json(categories)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while scraping the data' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}