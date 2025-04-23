import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#1e2649] text-white font-bebas">
      <div className="max-w-7xl mx-auto p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors mb-8"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-xl tracking-wider">Back to Home</span>
        </Link>

        <h1 className="text-5xl md:text-7xl tracking-wider mb-8">Peace Statistics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample dashboard cards */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-3xl text-amber-300 tracking-wider mb-4">Regional Breakdown</h2>
            <div className="h-64 bg-white/5 rounded flex items-center justify-center">
              <p className="text-xl tracking-wider">Interactive Chart Coming Soon</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-3xl text-amber-300 tracking-wider mb-4">Timeline</h2>
            <div className="h-64 bg-white/5 rounded flex items-center justify-center">
              <p className="text-xl tracking-wider">Interactive Chart Coming Soon</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-3xl text-amber-300 tracking-wider mb-4">Impact Metrics</h2>
            <div className="h-64 bg-white/5 rounded flex items-center justify-center">
              <p className="text-xl tracking-wider">Interactive Chart Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

