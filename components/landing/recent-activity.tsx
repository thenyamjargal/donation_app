import { Heart } from 'lucide-react'
import { recentSupporters } from '@/lib/data'

export function RecentActivity() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Сүүлийн дэмжлэгүүд
          </h2>
          <p className="text-muted-foreground">
            Бүтээлч нарт ирж буй дэмжлэгүүдийг шууд хараарай
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {recentSupporters.map((supporter) => (
            <div 
              key={supporter.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">
                    {supporter.isAnonymous ? 'Нэргүй' : supporter.name}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="truncate text-muted-foreground">
                    {supporter.creatorName}
                  </span>
                </div>
                <p className="mb-2 line-clamp-1 text-sm text-muted-foreground">
                  {supporter.message}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-primary">
                    {supporter.amount.toLocaleString()}₮
                  </span>
                  <span className="text-muted-foreground">
                    {supporter.createdAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
