import { Suspense } from 'react'
import DeliveryCodes from './components/DeliveryCodes'

async function getCategories() {
  try {
    // 使用相對路徑，這樣在部署時會自動使用正確的域名
    const res = await fetch('/api/scrape', { 
      cache: 'no-store',
      next: { revalidate: 3600 } // 重新驗證數據的時間間隔，這裡設置為1小時
    })
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {}
  }
}

export default async function Home() {
  const categories = await getCategories()
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeliveryCodes categories={categories} />
    </Suspense>
  )
}