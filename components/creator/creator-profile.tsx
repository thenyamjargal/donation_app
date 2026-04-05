'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Instagram, Youtube, Facebook, Twitter, Users, Heart } from 'lucide-react'
import { Creator } from '@/lib/types'
import { supportAmounts, recentSupporters } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { SupportCard } from './support-card'
import { PaymentModal } from '@/components/payment/payment-modal'

interface CreatorProfileProps {
  creator: Creator
}

export function CreatorProfile({ creator }: CreatorProfileProps) {
  const [selectedAmount, setSelectedAmount] = useState(supportAmounts[1].value)
  const [customAmount, setCustomAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const creatorSupporters = recentSupporters.filter(s => s.creatorName === creator.name)

  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount

  const handleSupport = () => {
    if (finalAmount >= 1000) {
      setIsPaymentOpen(true)
    }
  }

  const socialIcons = {
    instagram: Instagram,
    youtube: Youtube,
    facebook: Facebook,
    twitter: Twitter,
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pb-20">
        {/* Cover Image */}
        <div className="relative -mx-4 h-48 overflow-hidden bg-muted md:mx-0 md:mt-6 md:h-64 md:rounded-2xl">
          <Image
            src={creator.cover}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            {/* Avatar and Basic Info */}
            <div className="relative -mt-16 mb-6 flex flex-col items-center text-center md:-mt-20 lg:items-start lg:text-left">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-lg md:h-40 md:w-40">
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="mt-4">
                <h1 className="text-2xl font-bold md:text-3xl">{creator.name}</h1>
                <p className="text-muted-foreground">@{creator.username}</p>
              </div>

              {/* Social Links */}
              {Object.keys(creator.socialLinks).length > 0 && (
                <div className="mt-4 flex gap-2">
                  {Object.entries(creator.socialLinks).map(([platform, handle]) => {
                    const Icon = socialIcons[platform as keyof typeof socialIcons]
                    if (!Icon || !handle) return null
                    return (
                      <a
                        key={platform}
                        href={`https://${platform}.com/${handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label={platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mb-6 flex justify-center gap-8 lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold lg:justify-start">
                  <Users className="h-5 w-5 text-primary" />
                  {creator.supportersCount}
                </div>
                <p className="text-sm text-muted-foreground">Дэмжигчид</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold lg:justify-start">
                  <Heart className="h-5 w-5 text-primary" />
                  {(creator.totalSupport / 1000000).toFixed(1)}M₮
                </div>
                <p className="text-sm text-muted-foreground">Нийт дэмжлэг</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8 rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 font-semibold">Миний тухай</h2>
              <p className="leading-relaxed text-muted-foreground">{creator.bio}</p>
            </div>

            {/* Mobile Support Card */}
            <div className="mb-8 lg:hidden">
              <SupportCard
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                message={message}
                onAmountSelect={setSelectedAmount}
                onCustomAmountChange={setCustomAmount}
                onMessageChange={setMessage}
                onSupport={handleSupport}
              />
            </div>

            {/* Recent Supporters */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-semibold">Сүүлийн дэмжлэгүүд</h2>
              {creatorSupporters.length > 0 ? (
                <div className="space-y-4">
                  {creatorSupporters.map((supporter) => (
                    <div key={supporter.id} className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">
                            {supporter.isAnonymous ? 'Нэргүй' : supporter.name}
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {supporter.amount.toLocaleString()}₮
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{supporter.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{supporter.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <Heart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="font-medium">Одоохондоо дэмжлэг байхгүй</p>
                  <p className="text-sm text-muted-foreground">Анхны дэмжигч болоорой!</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Sticky Support Card */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <SupportCard
                selectedAmount={selectedAmount}
                customAmount={customAmount}
                message={message}
                onAmountSelect={setSelectedAmount}
                onCustomAmountChange={setCustomAmount}
                onMessageChange={setMessage}
                onSupport={handleSupport}
              />
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={finalAmount}
        creatorName={creator.name}
        message={message}
      />
    </>
  )
}
