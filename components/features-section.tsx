import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Users, Shield, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Real-Time Data",
    description: "Access live mapping data and survey information instantly with our advanced technology platform.",
  },
  {
    icon: Users,
    title: "Local Expertise",
    description: "Benefit from our deep knowledge of Kwara State terrain and local surveying requirements.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security and 99.9% uptime guarantee.",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Get your survey results quickly with our optimized processing algorithms and workflows.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">Why Choose Kwara Survey Control?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            We provide comprehensive surveying solutions with cutting-edge technology and local expertise you can trust.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
