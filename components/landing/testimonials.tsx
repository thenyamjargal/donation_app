import Image from 'next/image'
import { Quote } from 'lucide-react'
import { testimonials } from '@/lib/data'

export function Testimonials() {
  return (
    <section className="border-t border-border bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Бүтээлч нарын сэтгэгдэл
          </h2>
          <p className="text-muted-foreground">
            Платформыг ашиглаж буй бүтээлч нарын үнэлгээ
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="relative rounded-2xl border border-border bg-background p-6"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/20" />
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
