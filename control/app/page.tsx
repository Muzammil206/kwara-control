import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-stripe-gradient-start via-stripe-gradient-middle to-stripe-gradient-end">
      <Card className="w-full max-w-md rounded-stripe-xl shadow-2xl border-none bg-white p-8">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-stripe-dark-blue">Welcome Back</CardTitle>
          <CardDescription className="text-stripe-text-light">
            Sign in to your Kwara State Control Portal account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stripe-text-dark">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-stripe-text-dark"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-stripe-text-dark">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="h-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-stripe-text-dark"
            />
          </div>
          <div className="flex items-center justify-end">
            <Link href="#" className="text-sm text-blue-600 hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-12 rounded-lg bg-stripe-dark-blue text-white text-lg font-semibold shadow-md hover:bg-blue-800 transition-colors duration-200">
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
