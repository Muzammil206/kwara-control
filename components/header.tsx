"use client"

import Link from "next/link"
import { MapPin, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50 rounded-xl w-[90%] mx-auto my-4">
      <div className="container mx-auto px-4 py-4 ">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">Kwara Control</span>
              
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="relative text-white hover:text-blue-300 transition-colors group">
              Home
              <span className="absolute -bottom-1 left-0 w-full h-0.5 border-b-2 border-dotted border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link href="/dashboard" className="relative text-white hover:text-blue-300 transition-colors group">
              Map
              <span className="absolute -bottom-1 left-0 w-full h-0.5 border-b-2 border-dotted border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link href="#programs" className="relative text-white hover:text-blue-300 transition-colors group">
              Programs
              <span className="absolute -bottom-1 left-0 w-full h-0.5 border-b-2 border-dotted border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link href="#resources" className="relative text-white hover:text-blue-300 transition-colors group">
              Resources
              <span className="absolute -bottom-1 left-0 w-full h-0.5 border-b-2 border-dotted border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            <Link href="/contact" className="relative text-white hover:text-blue-300 transition-colors group">
              Contact us
              <span className="absolute -bottom-1 left-0 w-full h-0.5 border-b-2 border-dotted border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-white hover:text-blue-300 transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 border-2 border-white rounded-lg text-white hover:bg-white hover:text-slate-900 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-700">
            <nav className="flex flex-col gap-4 mt-4">
              <Link
                href="/"
                className="text-white hover:text-blue-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#courses"
                className="text-white hover:text-blue-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="#programs"
                className="text-white hover:text-blue-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Programs
              </Link>
              <Link
                href="#resources"
                className="text-white hover:text-blue-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-blue-300 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact us
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-700">
                <Link
                  href="/login"
                  className="text-white hover:text-blue-300 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 border-2 border-white rounded-lg text-white hover:bg-white hover:text-slate-900 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
