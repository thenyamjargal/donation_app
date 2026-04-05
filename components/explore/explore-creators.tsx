'use client'

import { useState, useMemo } from 'react'
import { Search, Users } from 'lucide-react'
import { CreatorCard } from '@/components/creator-card'
import { creators, categories } from '@/lib/data'

export function ExploreCreators() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch = 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === 'all' || creator.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
          Бүтээлч нар
        </h1>
        <p className="text-muted-foreground">
          Монголын бүтээлч нарыг хайж олоод, тэднийг дэмжээрэй
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Бүтээлч хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredCreators.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {filteredCreators.length} бүтээлч олдлоо
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState searchQuery={searchQuery} selectedCategory={selectedCategory} />
      )}
    </div>
  )
}

function EmptyState({ 
  searchQuery, 
  selectedCategory 
}: { 
  searchQuery: string
  selectedCategory: string 
}) {
  const category = categories.find(c => c.id === selectedCategory)

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Бүтээлч олдсонгүй</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {searchQuery 
          ? `"${searchQuery}" хайлтын үр дүн олдсонгүй.`
          : category && category.id !== 'all'
            ? `"${category.label}" ангилалд бүтээлч одоогоор байхгүй байна.`
            : 'Хайлтын нөхцөлөө өөрчилж үзнэ үү.'}
      </p>
    </div>
  )
}
