'use client'

import { useState } from 'react'

interface Categories {
  [platform: string]: {
    [category: string]: any[]
  }
}

export default function Sidebar({ categories }: { categories: Categories }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      <div
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md cursor-pointer"
        onClick={toggleSidebar}
      >
        ☰
      </div>
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">菜單</h2>
          <ul>
            {Object.entries(categories).map(([platform, platformCategories]) => (
              <li key={platform} className="mb-2">
                <a href={`#${platform}`} className="text-blue-600 dark:text-blue-400 hover:underline" onClick={toggleSidebar}>{platform}</a>
                <ul className="ml-4">
                  {Object.keys(platformCategories).map((category) => (
                    <li key={category}>
                      <a href={`#${platform}-${category}`} className="text-gray-600 dark:text-gray-400 hover:underline" onClick={toggleSidebar}>- {category}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}