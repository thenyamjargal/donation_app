export interface Creator {
  id: string
  name: string
  username: string
  avatar: string
  cover: string
  bio: string
  category: string
  socialLinks: {
    instagram?: string
    youtube?: string
    facebook?: string
    twitter?: string
  }
  supportersCount: number
  totalSupport: number
}

export interface Supporter {
  id: string
  name: string
  message: string
  amount: number
  createdAt: string
  isAnonymous: boolean
}

export interface SupportAmount {
  value: number
  label: string
  emoji: string
}

export type PaymentState = 'idle' | 'selecting' | 'processing' | 'success'
