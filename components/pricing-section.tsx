import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Daily Access",
    price: "₦2,500",
    period: "per day",
    description: "Perfect for short-term projects and quick surveys",
    features: [
      "Full map access for 24 hours",
      "Basic survey tools",
      "Standard support",
      "Export capabilities",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Pro Monthly",
    price: "₦45,000",
    period: "per month",
    description: "Ideal for ongoing projects and professional surveyors",
    features: [
      "Unlimited map access",
      "Advanced survey tools",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
      "Custom reporting",
      "API access",
      "Data backup",
    ],
    popular: true,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-balance text-slate-800">Choose Your Plan</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty font-medium">
            Flexible pricing options designed to meet your surveying needs, whether for a single project or ongoing
            operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-semibold text-slate-800">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                  <span className="text-slate-500 ml-2 font-medium">{plan.period}</span>
                </div>
                <CardDescription className="mt-2 text-pretty text-slate-600 font-medium">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 bg-white"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
