import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">Welcome</h1>
          <div className="text-2xl md:text-4xl font-semibold text-white/90 drop-shadow-md">
            to Kwara State Control Portal
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p className="text-xl text-white/80 mb-6 leading-relaxed">
            Your comprehensive platform for monitoring and managing control systems across Kwara State. Access real-time
            data, coordinate information, and system controls all in one place.
          </p>

          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-8 py-3 text-lg">
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Monitoring</h3>
            <p className="text-white/70">Monitor all control systems in real-time</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">Coordinate Search</h3>
            <p className="text-white/70">Search and locate controls by coordinates</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">System Management</h3>
            <p className="text-white/70">Manage and control system operations</p>
          </div>
        </div>
      </div>
    </div>
  )
}
