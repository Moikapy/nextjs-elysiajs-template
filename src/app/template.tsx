'use client'
import React,{Fragment} from 'react'

import Link from "next/link"
export default function Layout({children}){
  return(   
    <div className="layout h-screen flex flex-col justify-between font-mono">
      <header className="py-4 border-b border-accent">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl"><Link href="/">My Minimal Blog</Link></h1>
          <nav className="space-x-4">
            <Link href="/blogs" className="hover:text-secondary">
              Blogs
            </Link>
            <Link href="/profile" className="hover:text-secondary">
              Profile
            </Link>
          </nav>
        </div>
      </header>


      {children}
      {/* Footer */}

      <footer className="py-8 border-t border-accent mt-16">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 My Minimal Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
