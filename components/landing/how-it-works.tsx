import { Search, Heart, CreditCard } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Бүтээлч олох',
    description: 'Дуртай бүтээлч нараа хайж олоод, тэдний хуудсанд зочлоорой.',
  },
  {
    icon: Heart,
    title: 'Дүн сонгох',
    description: 'Өөрийн хүссэн дүнгээр дэмжлэг илгээж, мессеж бичээрэй.',
  },
  {
    icon: CreditCard,
    title: 'QPay-ээр төлөх',
    description: 'QPay эсвэл банкны аппаар хурдан, аюулгүй төлбөр хийгээрэй.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Хэрхэн ажилладаг
          </h2>
          <p className="text-muted-foreground">
            Гурхан алхамаар дуртай бүтээлч нартаа дэмжлэг илгээгээрэй
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative rounded-2xl border border-border bg-card p-8 text-center"
            >
              <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
