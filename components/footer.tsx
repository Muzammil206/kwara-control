import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              <span className="text-lg font-bold">Kwara Survey Control</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Professional surveying and mapping solutions for Kwara State and beyond. Precision you can trust.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-accent transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-accent transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@kwarasurvey.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+234 803 123 4567</span>
              </div>
              <div className="flex gap-3 mt-4">
                <Facebook className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; 2024 Kwara Survey Control. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
