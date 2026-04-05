import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreatorCard } from '@/components/creator-card'
import { creators } from '@/lib/data'

export function FeaturedCreators() {
  const featuredCreators = creators.slice(0, 3)

  return (
    <section className="border-t border-border bg-card py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
              Онцлох бүтээлч нар
            </h2>
            <p className="text-muted-foreground">
              Олон хүний дэмжлэг хүлээж буй бүтээлч нартай танилцаарай
            </p>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/explore">
              Бүгдийг үзэх
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  )
}
