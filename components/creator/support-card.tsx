'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supportAmounts } from '@/lib/data'

interface SupportCardProps {
  selectedAmount: number
  customAmount: string
  message: string
  onAmountSelect: (amount: number) => void
  onCustomAmountChange: (amount: string) => void
  onMessageChange: (message: string) => void
  onSupport: () => void
}

export function SupportCard({
  selectedAmount,
  customAmount,
  message,
  onAmountSelect,
  onCustomAmountChange,
  onMessageChange,
  onSupport,
}: SupportCardProps) {
  const finalAmount = customAmount ? parseInt(customAmount) : selectedAmount
  const isValidAmount = finalAmount >= 1000

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Дэмжлэг илгээх</h2>

      {/* Preset Amounts */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {supportAmounts.map((amount) => (
          <button
            key={amount.value}
            onClick={() => {
              onAmountSelect(amount.value)
              onCustomAmountChange('')
            }}
            className={`flex flex-col items-center rounded-xl border-2 p-4 transition-all ${
              selectedAmount === amount.value && !customAmount
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="mb-1 text-xl">{amount.emoji}</span>
            <span className="font-semibold">{amount.label}</span>
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Өөр дүн оруулах
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="5,000"
            value={customAmount}
            onChange={(e) => onCustomAmountChange(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 pr-12 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            min="1000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            ₮
          </span>
        </div>
        {customAmount && parseInt(customAmount) < 1000 && (
          <p className="mt-1 text-xs text-destructive">
            Хамгийн багадаа 1,000₮
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">
          Мессеж (заавал биш)
        </label>
        <textarea
          placeholder="Бүтээлч нартаа урам өгөх үг бичээрэй..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="min-h-25 w-full resize-none rounded-xl border border-input bg-background p-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          maxLength={200}
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {message.length}/200
        </p>
      </div>

      {/* Support Button */}
      <Button 
        className="w-full gap-2" 
        size="lg"
        onClick={onSupport}
        disabled={!isValidAmount}
      >
        <Heart className="h-5 w-5" />
        {isValidAmount ? `${finalAmount.toLocaleString()}₮ дэмжлэг илгээх` : 'Дүн сонгоно уу'}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        QPay эсвэл банкны аппаар төлөх боломжтой
      </p>
    </div>
  )
}
