import Link from 'next/link'
import Image from 'next/image'
import { Users } from 'lucide-react'
import { Creator } from '@/lib/types'
import { categories } from '@/lib/data'

interface CreatorCardProps {
  creator: Creator
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const category = categories.find(c => c.id === creator.category)

  return (
    <Link 
      href={`/creator/${creator.username}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative h-28 overflow-hidden bg-muted">
        <Image
          src={creator.cover}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="relative px-4 pb-5">
        <div className="relative -mt-10 mb-3 h-20 w-20 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-sm">
          <Image
            src={creator.avatar}
            alt={creator.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="mb-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {creator.name}
          </h3>
          <p className="text-sm text-muted-foreground">@{creator.username}</p>
        </div>
        
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {creator.bio}
        </p>
        
        <div className="flex items-center justify-between">
          {category && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {category.label}
            </span>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{creator.supportersCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
