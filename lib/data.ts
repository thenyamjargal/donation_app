import { Creator, Supporter, SupportAmount } from './types'

export const supportAmounts: SupportAmount[] = [
  { value: 5000, label: '5,000₮', emoji: '☕' },
  { value: 10000, label: '10,000₮', emoji: '🍜' },
  { value: 25000, label: '25,000₮', emoji: '🎁' },
  { value: 50000, label: '50,000₮', emoji: '🌟' },
]

export const categories = [
  { id: 'all', label: 'Бүгд' },
  { id: 'music', label: 'Хөгжим' },
  { id: 'art', label: 'Урлаг' },
  { id: 'tech', label: 'Технологи' },
  { id: 'education', label: 'Боловсрол' },
  { id: 'gaming', label: 'Тоглоом' },
  { id: 'lifestyle', label: 'Амьдралын хэв маяг' },
]

export const creators: Creator[] = [
  {
    id: '1',
    name: 'Болормаа Эрдэнэ',
    username: 'bolormaa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop',
    bio: 'Хөгжимчин, дуучин. Монгол ардын уламжлалт хөгжмийг орчин үеийн өнгө аястай хослуулан шинэ бүтээлүүд туурвидаг.',
    category: 'music',
    socialLinks: {
      instagram: 'bolormaa_music',
      youtube: 'BolormaaMusic',
      facebook: 'bolormaamusic',
    },
    supportersCount: 342,
    totalSupport: 4250000,
  },
  {
    id: '2',
    name: 'Тэмүүлэн Б.',
    username: 'temuulen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop',
    bio: 'Технологийн сэдвээр контент бүтээгч. Програмчлал, веб хөгжүүлэлт, AI-ийн талаар Монгол хэлээр хичээл заадаг.',
    category: 'tech',
    socialLinks: {
      youtube: 'TemuulenTech',
      twitter: 'temuulen_dev',
    },
    supportersCount: 567,
    totalSupport: 8900000,
  },
  {
    id: '3',
    name: 'Сарангэрэл Д.',
    username: 'sarangerel',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=400&fit=crop',
    bio: 'Зураач, график дизайнер. Монгол уламжлалт урлагийг дижитал орчинд шинэчлэн бүтээдэг.',
    category: 'art',
    socialLinks: {
      instagram: 'sarangerel_art',
      facebook: 'sarangerelart',
    },
    supportersCount: 234,
    totalSupport: 3100000,
  },
  {
    id: '4',
    name: 'Батбаяр Г.',
    username: 'batbayar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1200&h=400&fit=crop',
    bio: 'Боловсролын контент бүтээгч. Математик, физикийн хичээлүүдийг хялбараар тайлбарладаг.',
    category: 'education',
    socialLinks: {
      youtube: 'BatbayarEdu',
      facebook: 'batbayaredu',
    },
    supportersCount: 891,
    totalSupport: 12500000,
  },
  {
    id: '5',
    name: 'Оюунгэрэл М.',
    username: 'oyungerel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop',
    bio: 'Амьдралын хэв маягийн блогер. Эрүүл амьдрал, гоо сайхан, аялалын талаар бичдэг.',
    category: 'lifestyle',
    socialLinks: {
      instagram: 'oyungerel_life',
      youtube: 'OyungerelLife',
    },
    supportersCount: 456,
    totalSupport: 5800000,
  },
  {
    id: '6',
    name: 'Ганзориг Н.',
    username: 'ganzorig',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=400&fit=crop',
    bio: 'Тоглоомын стример, esports тоглогч. Монголын тоглоомын соёлыг дэлхийд таниулдаг.',
    category: 'gaming',
    socialLinks: {
      youtube: 'GanzorigGaming',
      twitter: 'ganzorig_gg',
    },
    supportersCount: 723,
    totalSupport: 9200000,
  },
]

export const recentSupporters: (Supporter & { creatorName: string })[] = [
  {
    id: '1',
    name: 'Мөнхбат',
    message: 'Дуунууд чинь үнэхээр гайхалтай! Үргэлжлүүлээрэй 💪',
    amount: 10000,
    createdAt: '2 минутын өмнө',
    isAnonymous: false,
    creatorName: 'Болормаа Эрдэнэ',
  },
  {
    id: '2',
    name: 'Нэргүй',
    message: 'Хичээлүүд маш тустай байна. Баярлалаа!',
    amount: 25000,
    createdAt: '15 минутын өмнө',
    isAnonymous: true,
    creatorName: 'Тэмүүлэн Б.',
  },
  {
    id: '3',
    name: 'Сүхээ',
    message: 'Зургууд чинь үнэхээр гоё! Илүү их бүтээл хүлээж байна.',
    amount: 5000,
    createdAt: '32 минутын өмнө',
    isAnonymous: false,
    creatorName: 'Сарангэрэл Д.',
  },
  {
    id: '4',
    name: 'Ариунаа',
    message: 'Математикийн хичээл маш ойлгомжтой байна!',
    amount: 50000,
    createdAt: '1 цагийн өмнө',
    isAnonymous: false,
    creatorName: 'Батбаяр Г.',
  },
]

export const testimonials = [
  {
    id: '1',
    name: 'Энхжаргал Б.',
    role: 'Хөгжимчин',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    content: 'Дэмжих платформ надад өөрийн бүтээлээ үргэлжлүүлэх боломжийг олгосон. Дэмжигч нартаа маш их талархалтай байна.',
  },
  {
    id: '2',
    name: 'Дорж Н.',
    role: 'Контент бүтээгч',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    content: 'QPay-ээр төлбөр хийх нь маш хялбар. Дэмжигч нар минь хурдан, найдвартай дэмжлэг илгээж чаддаг болсон.',
  },
  {
    id: '3',
    name: 'Номин У.',
    role: 'Зураач',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop',
    content: 'Энэ платформ нь бүтээлч хүмүүст үнэхээр хэрэгтэй байна. Ашиглахад хялбар, найдвартай.',
  },
]

export const bankApps = [
  { id: 'khanbank', name: 'Хаан банк', color: '#006837' },
  { id: 'golomt', name: 'Голомт банк', color: '#004B87' },
  { id: 'tdb', name: 'ХХБ', color: '#ED1C24' },
  { id: 'statebank', name: 'Төрийн банк', color: '#00529B' },
  { id: 'xacbank', name: 'Хас банк', color: '#E31837' },
  { id: 'bogdbank', name: 'Богд банк', color: '#1E3A8A' },
  { id: 'capitron', name: 'Капитрон', color: '#0066CC' },
  { id: 'most', name: 'Мост мани', color: '#FF6B00' },
]
