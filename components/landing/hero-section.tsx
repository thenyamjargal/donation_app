import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <Heart className="h-4 w-4 text-primary" />
            <span>Монголын бүтээлч нарыг дэмжих платформ</span>
          </div>
          
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Дуртай бүтээлч нартаа{' '}
            <span className="text-primary">талархал</span>{' '}
            илгээгээрэй
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            QPay-ээр хялбархан төлбөр хийж, Монголын бүтээлч нарыг шууд дэмжээрэй. 
            Таны дэмжлэг тэдний бүтээлийг үргэлжлүүлэх хүч болно.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
              <Link href="/explore">
                Бүтээлч нар үзэх
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/#how-it-works">
                Хэрхэн ажилладаг
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  )
}
