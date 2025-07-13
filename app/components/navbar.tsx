import Link from 'next/link'
import { Code2 } from 'lucide-react'
import { ThemeToggle } from './theme-provider'

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-gray-900 dark:text-white" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">DevTools</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

