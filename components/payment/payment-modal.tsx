'use client'

import { useState, useEffect } from 'react'
import { X, Heart, CheckCircle2, Loader2, QrCode, Smartphone, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { bankApps } from '@/lib/data'
import { PaymentState } from '@/lib/types'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  creatorName: string
  message: string
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  creatorName,
  message,
}: PaymentModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [supporterName, setSupporterName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentState('idle')
      setSupporterName('')
      setIsAnonymous(false)
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleProceedToPayment = () => {
    setPaymentState('selecting')
  }

  const handlePaymentSelect = () => {
    setPaymentState('processing')
    // Simulate payment processing
    setTimeout(() => {
      setPaymentState('success')
    }, 2000)
  }

  const handleClose = () => {
    setPaymentState('idle')
    onClose()
  }

  function handlePaymx(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={paymentState === 'processing' ? undefined : handleClose}
      />
      
      {/* Modal */}
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-background sm:max-w-lg sm:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background p-4">
          {paymentState === 'selecting' ? (
            <button
              onClick={() => setPaymentState('idle')}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div />
          )}
          <h2 className="text-lg font-semibold">
            {paymentState === 'success' ? 'Баярлалаа!' : 'Дэмжлэг илгээх'}
          </h2>
          {paymentState !== 'processing' ? (
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary"
              aria-label="Хаах"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>

        <div className="p-6">
          {paymentState === 'idle' && (
            <IdleState
              amount={amount}
              creatorName={creatorName}
              message={message}
              supporterName={supporterName}
              isAnonymous={isAnonymous}
              onNameChange={setSupporterName}
              onAnonymousChange={setIsAnonymous}
              onProceed={handleProceedToPayment}
            />
          )}

          {paymentState === 'selecting' && (
            <SelectingState
              amount={amount}
              onPaymentSelect={handlePaymentSelect}
            />
          )}

          {paymentState === 'processing' && (
            <ProcessingState amount={amount} />
          )}

          {paymentState === 'success' && (
            <SuccessState
              amount={amount}
              creatorName={creatorName}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function IdleState({
  amount,
  creatorName,
  message,
  supporterName,
  isAnonymous,
  onNameChange,
  onAnonymousChange,
  onProceed,
}: {
  amount: number
  creatorName: string
  message: string
  supporterName: string
  isAnonymous: boolean
  onNameChange: (name: string) => void
  onAnonymousChange: (anonymous: boolean) => void
  onProceed: () => void
}) {
  return (
    <>
      {/* Summary Card */}
      <div className="mb-6 rounded-xl bg-secondary p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Хүлээн авагч</span>
          <span className="font-medium">{creatorName}</span>
        </div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Дүн</span>
          <span className="text-xl font-bold text-primary">{amount.toLocaleString()}₮</span>
        </div>
        {message && (
          <div className="border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">Мессеж:</p>
            <p className="mt-1 text-sm">{message}</p>
          </div>
        )}
      </div>

      {/* Supporter Name Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Таны нэр
        </label>
        <input
          type="text"
          placeholder="Нэрээ оруулна уу"
          value={supporterName}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={isAnonymous}
          className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
      </div>

      {/* Anonymous Checkbox */}
      <label className="mb-6 flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => onAnonymousChange(e.target.checked)}
          className="h-5 w-5 rounded border-input accent-primary"
        />
        <span className="text-sm">Нэргүй илгээх</span>
      </label>

      {/* Proceed Button */}
      <Button 
        className="w-full gap-2" 
        size="lg"
        onClick={onProceed}
        disabled={!isAnonymous && !supporterName.trim()}
      >
        <Heart className="h-5 w-5" />
        Төлбөр хийх
      </Button>
    </>
  )
}

function SelectingState({
  amount,
  onPaymentSelect,
}: {
  amount: number
  onPaymentSelect: () => void
}) {
  return (
    <>
      {/* Amount Display */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground">Төлөх дүн</p>
        <p className="text-3xl font-bold text-primary">{amount.toLocaleString()}₮</p>
      </div>

      {/* QPay QR Section */}
      <div className="mb-6 rounded-xl border border-border p-6">
        <div className="mb-4 flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <span className="font-semibold">QPay QR код</span>
        </div>
        <div className="mb-4 flex justify-center">
          <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-secondary">
            <div className="text-center">
              <QrCode className="mx-auto mb-2 h-16 w-16 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">QR код</p>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          QPay эсвэл банкны аппаар QR кодыг уншуулна уу
        </p>
      </div>

      {/* Bank App Buttons */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Smartphone className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Аппаар төлөх</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {bankApps.map((bank) => (
            <button
              key={bank.id}
              onClick={onPaymentSelect}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50 hover:bg-secondary"
            >
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-xs font-bold"
                style={{ backgroundColor: bank.color }}
              >
                {bank.name.charAt(0)}
              </div>
              <span className="text-center text-xs leading-tight">{bank.name}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Банкны аппаар нэвтрэх товч дээр дарснаар төлбөр хийх хуудас руу шилжинэ
      </p>
    </>
  )
}

function ProcessingState({ amount }: { amount: number }) {
  return (
    <div className="py-12 text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold">Төлбөр хүлээгдэж байна</h3>
      <p className="mb-4 text-muted-foreground">
        Банкны апп дээр төлбөрөө баталгаажуулна уу
      </p>
      <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
        <span className="text-sm font-medium">{amount.toLocaleString()}₮</span>
      </div>
    </div>
  )
}

function SuccessState({
  amount,
  creatorName,
  onClose,
}: {
  amount: number
  creatorName: string
  onClose: () => void
}) {
  return (
    <div className="py-8 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold">Амжилттай!</h3>
      <p className="mb-6 text-muted-foreground">
        Таны {amount.toLocaleString()}₮ дэмжлэг{' '}
        <span className="font-medium text-foreground">{creatorName}</span>
        -д амжилттай хүргэгдлээ.
      </p>
      <div className="mb-6 rounded-xl bg-secondary p-4">
        <Heart className="mx-auto mb-2 h-8 w-8 text-primary" />
        <p className="text-sm text-muted-foreground">
          Таны дэмжлэг бүтээлчийн бүтээлийг үргэлжлүүлэх хүч болно. Баярлалаа!
        </p>
      </div>
      <Button onClick={onClose} className="w-full" size="lg">
        Буцах
      </Button>
    </div>
  )
}
