import Link from 'next/link'
import { Code2 } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="w-8 h-8 text-white" />
          <span className="text-xl font-bold">DevTools</span>
        </Link>
        <div>
          <Link href="/" className="mr-4 hover:text-gray-300">
            Home
          </Link>
          {/* <Link href="/about" className="hover:text-gray-300">
            About
          </Link> */}
        </div>
      </div>
    </nav>
  )
}

