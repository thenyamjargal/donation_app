import { Shield, Zap, Users, Wallet } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Найдвартай төлбөр',
    description: 'QPay-ээр баталгаажсан аюулгүй төлбөрийн систем',
  },
  {
    icon: Zap,
    title: 'Шууд хүргэлт',
    description: 'Таны дэмжлэг бүтээлчид шууд хүрнэ',
  },
  {
    icon: Users,
    title: 'Олон бүтээлч',
    description: 'Хөгжим, урлаг, боловсрол гэх мэт олон төрлийн бүтээлч нар',
  },
  {
    icon: Wallet,
    title: 'Хялбар ашиглалт',
    description: 'Бүртгэлгүйгээр шууд дэмжлэг илгээх боломжтой',
  },
]

export function TrustSection() {
  return (
    <section className="border-t border-border bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Яагаад Дэмжих?
          </h2>
          <p className="text-muted-foreground">
            Монголын бүтээлч нарыг дэмжих хамгийн найдвартай платформ
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
