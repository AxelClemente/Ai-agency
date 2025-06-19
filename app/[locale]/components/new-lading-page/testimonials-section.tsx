import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TestimonialsSection() {
  const testimonials = [
    {
      company: "accenture",
      quote:
        "Drives greater creativity. With Writer, we've enhanced content creation, productivity, and our entire marketing impact.",
      author: {
        name: "Jill Kramer",
        title: "Chief Marketing & Communications Officer at Accenture",
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    {
      company: "Qualcomm",
      quote:
        "Provided instant benefits from day 1. Optimizes our campaign assets for different audiences and streamlines our internal communications.",
      author: {
        name: "Cristina Tiu",
        title: "Chief Marketing & Communications Executive",
        image: "/placeholder.svg?height=60&width=60",
      },
    },
    {
      company: "CIRRUS MD",
      quote:
        "Revolutionizing how we scale care. It enables us to maintain personalized patient relationships at scale, streamlined experience for our physicians.",
      author: {
        name: "Tanya Gilland",
        title: "EVP of Product Management & Innovation at Cirrus MD",
        image: "/placeholder.svg?height=60&width=60",
      },
    },
  ]

  return (
    <section className="py-20 bg-white text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            See how our customers streamline workflows with <span className="text-indigo-600">generative AI</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 h-full flex flex-col">
              {/* Company Logo */}
              <div className="mb-6">
                <div className="text-xl font-bold text-gray-800">{testimonial.company}</div>
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.author.image || "/placeholder.svg"}
                    alt={testimonial.author.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.author.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium text-lg">
            Request a demo
          </Button>
        </div>
      </div>
    </section>
  )
}
