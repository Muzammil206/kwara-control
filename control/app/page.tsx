"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe, Radar } from "lucide-react"
import { useEffect, useState } from "react"

export default function WelcomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Blurred Gradient Background */}
      <div
        className="absolute inset-0 z-0 opacity-70"
        style={{
          background: `radial-gradient(at 10% 20%, #8a2be2, transparent 50%),
                       radial-gradient(at 90% 80%, #ff69b4, transparent 50%),
                       radial-gradient(at 50% 0%, #00bfff, transparent 50%)`,
          filter: "blur(100px)",
          transform: "scale(1.5)",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-16 max-w-6xl mx-auto">
          {/* Hero Section with Stripe-like Typography */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-stripe-dark-blue leading-tight tracking-tighter drop-shadow-lg">
              Financial <br className="hidden md:block" />
              infrastructure <br className="hidden md:block" />
              to grow your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-stripe-gradient-start via-stripe-gradient-middle to-stripe-gradient-end bg-clip-text text-transparent">
                revenue
              </span>
            </h1>
            <p className="text-lg md:text-xl text-stripe-text-light max-w-3xl mx-auto leading-relaxed">
              Join the millions of companies of all sizes that use Kwara State Control Portal to manage and coordinate
              critical infrastructure, gain real-time insights, and ensure operational excellence.
            </p>
          </div>

          {/* Call to Action with Stripe-like Button Design */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-14 px-8 rounded-lg bg-stripe-dark-blue text-white text-lg font-semibold shadow-md hover:bg-blue-800 transition-colors duration-200 flex items-center group"
              >
                <span className="relative z-10">Launch Control Center</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link href="#">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-lg border-2 border-gray-300 text-stripe-text-dark text-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors duration-200 flex items-center group bg-transparent"
              >
                <span className="relative z-10">Contact Support</span>
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>

          {/* Feature Cards - Simplified and integrated */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
            {[
              {
                icon: Shield,
                title: "Secure Access",
                desc: "Robust security protocols for data integrity.",
              },
              {
                icon: Zap,
                title: "Real-time Data",
                desc: "Instant monitoring and live system updates.",
              },
              {
                icon: Globe,
                title: "State Coverage",
                desc: "Comprehensive oversight across Kwara State.",
              },
              {
                icon: Radar,
                title: "Advanced Control",
                desc: "Precision management of all infrastructure.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-stripe-dark-blue mb-2">{feature.title}</h4>
                <p className="text-sm text-stripe-text-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
