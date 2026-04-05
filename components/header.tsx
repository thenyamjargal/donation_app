'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Дэмжих</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link 
            href="/explore" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Бүтээлч нар
          </Link>
          <Link 
            href="/#how-it-works" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Хэрхэн ажилладаг
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            Нэвтрэх
          </Button>
          <Button size="sm">
            Бүтээлч болох
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Цэс хаах' : 'Цэс нээх'}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/explore" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Бүтээлч нар
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Хэрхэн ажилладаг
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" size="sm" className="justify-start">
                Нэвтрэх
              </Button>
              <Button size="sm">
                Бүтээлч болох
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
