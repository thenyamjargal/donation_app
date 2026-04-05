import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Дэмжих</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Монголын бүтээлч нарыг дэмжих хамгийн хялбар арга.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Платформ</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Бүтээлч нар
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Хэрхэн ажилладаг
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Бүтээлч болох
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Тусламж</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Түгээмэл асуултууд
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Холбоо барих
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Тусламжийн төв
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Хууль эрх зүй</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Үйлчилгээний нөхцөл
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Нууцлалын бодлого
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 Дэмжих. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>QPay-ээр баталгаажсан төлбөр</span>
            <div className="h-6 w-px bg-border" />
            <span>🇲🇳 Монголд бүтээгдсэн</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
