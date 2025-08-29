import { MapPin, Users } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 text-gray-50"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="50,0 100,0 100,100 0,100" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 py-4 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          <div className=" z-10">
            <div className="space-y-6">
              <p className="text-sm font-semibold text-blue-600 tracking-wider uppercase">WE ARE SURVEY EXPERTS</p>

              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight text-slate-900">
                We create{" "}
                <span className="relative">
                  mapping
                  <span className="absolute bottom-2 left-0 w-full h-1 bg-blue-600"></span>
                </span>
                <br />
                solutions that makes surveying
                <br />
                easier & better.
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link
                href="/dashboard"
                className="text-blue-600 rounded-md py-3 px-6 border border-blue-600 text-sm hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Load Map
              </Link>
              <Link href="#about" className="text-slate-600 pt-2 pb-4 gap border-slate-200 hover:text-slate-800 font-medium transition-colors">
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative lg:ml-8">
            <div className="relative">
              <div className="relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 400" fill="none">
                  <defs>
                    <clipPath id="organic-shape">
                      <path d="M50 0C22.4 0 0 22.4 0 50v250c0 55.2 44.8 100 100 100h200c55.2 0 100-44.8 100-100V150c0-27.6-22.4-50-50-50H200c-27.6 0-50-22.4-50-50V50c0-27.6-22.4-50-50-50H50z" />
                    </clipPath>
                  </defs>
                </svg>

                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-slate-100 rounded-3xl overflow-hidden">
                  <img
                    src="/kwara.png"
                    alt="Professional surveying team working together"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">50+</p>
                    <p className="text-sm text-slate-600">Projects Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
