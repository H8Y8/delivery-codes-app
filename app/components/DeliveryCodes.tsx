'use client'
import React from 'react'
import Sidebar from './Sidebar'

interface CodeData {
  code: string
  content: string
  expiry: string
  deep_link: string
}

interface Categories {
  [platform: string]: {
    [category: string]: CodeData[]
  }
}

export default function DeliveryCodes({ categories }: { categories: Categories }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar categories={categories} />
      <main className="flex-1 p-6 ml-16 lg:ml-64">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">優惠碼領取</h1>
        {Object.entries(categories).map(([platform, platformCategories]) => (
          <div key={platform}>
            <h2 id={platform} className="text-2xl font-bold mt-8 mb-4 text-gray-700 dark:text-gray-300">{platform}</h2>
            {Object.entries(platformCategories).map(([category, codes]) => (
              <div key={category}>
                <h3 id={`${platform}-${category}`} className="text-xl font-semibold mt-6 mb-3 text-gray-600 dark:text-gray-400">{category}</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {codes.map((code) => (
                    <CodeCard key={code.code} {...code} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}

function CodeCard({ code, content, expiry, deep_link }: CodeData) {
  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('優惠碼已複製：' + code)
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:-translate-y-1">
      <div className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-200">{code}</div>
      <div className="text-gray-600 dark:text-gray-400 text-center mb-2">{content}</div>
      <div className="text-sm text-gray-500 dark:text-gray-500 text-center mb-4">有效期限: {expiry}</div>
      <a
        href={deep_link}
        onClick={(e) => {
          e.preventDefault()
          copyCode()
          setTimeout(() => {
            window.location.href = deep_link
          }, 500)
        }}
        className="block w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
      >
        複製優惠碼並開啟APP
      </a>
    </div>
  )
}