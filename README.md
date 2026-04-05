# sododtech.online

Монголын контент бүтээгчдэд зориулсан хандив цуглуулах платформ — QPay төлбөрийн систем болон Telegram мэдэгдэлтэй.

**Demo:** [http://sododtech.online](http://sododtech.online)

---

## Технологийн стек

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB (Mongoose)
- **Payment:** QPay
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Deploy:** Vercel

---

## Локалд ажиллуулах

### 1. Репозиторыг Fork & Clone хийх

```bash
# Fork хийсний дараа
git clone https://github.com/<таны-username>/sododtech.online.git
cd sododtech.online
```

### 2. Хамаарлуудыг суулгах

```bash
npm install
```

### 3. Environment хувьсагчдыг тохируулах

`.env.example` файлыг `.env` болгон хуулна:

```bash
cp .env.example .env
```

Дараа нь `.env` файлыг нээж утгуудыг бөглөнө (доорх хэсгийг үзнэ үү).

### 4. Dev server ажиллуулах

```bash
npm run dev
```

Браузерт [http://localhost:3000](http://localhost:3000) нээнэ.

---

## Environment хувьсагчдын тайлбар

```env
APP_URL=http://localhost:3000
```

### QPay

QPay merchant account-оос авах мэдээлэл:

```env
QPAY_ENABLED=true
QPAY_BASE_URL=https://merchant.qpay.mn
QPAY_USERNAME=            # QPay merchant нэвтрэх нэр
QPAY_PASSWORD=            # QPay merchant нууц үг
QPAY_INVOICE_CODE=        # QPay invoice template код
QPAY_CALLBACK_SECRET=     # Webhook аюулгүй байдлын нууц (заавал биш, санал болгоно)
```

> QPay sandbox тест хийхэд `QPAY_BASE_URL=https://sandbox.qpay.mn` болгоно.

### MongoDB Atlas

```env
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

> Atlas тохируулах заавар доорх хэсгийг үзнэ үү.

### Telegram мэдэгдэл

Амжилттай төлбөр болох бүрд Telegram-д мэдэгдэл илгээнэ:

```env
TELEGRAM_BOT_TOKEN=       # @BotFather-аас авах
TELEGRAM_CHAT_ID=         # Мэдэгдэл очих chat-ийн ID
```

> Telegram bot үүсгэх болон chat ID авах заавар доорх хэсгийг үзнэ үү.

### Харагдах байдал

```env
NEXT_PUBLIC_THEME=stone   # stone | rose | blue | emerald | violet | orange | ...
```

Боломжит өнгөнүүд: `stone`, `rose`, `blue`, `emerald`, `violet`, `orange`, `cyan`, `pink`, `amber`, `teal`, `indigo`, `red`, `lime`, `fuchsia`, `sky`, `slate`

### Сошиал холбоосууд

```env
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_YOUTUBE_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
```

---

## MongoDB Atlas тохируулах

1. [https://cloud.mongodb.com](https://cloud.mongodb.com) руу орж бүртгүүлэх эсвэл нэвтрэх
2. **New Project** → нэр өгч үүсгэх
3. **Build a Database** → **Free (M0)** tier сонгох
4. Cloud provider болон бүс сонгох (жишээ: AWS, Singapore)
5. **Username / Password** үүсгэх → нууг үг хадгалах
6. **Network Access** → **Add IP Address** → `0.0.0.0/0` (бүх IP зөвшөөрөх) эсвэл тодорхой IP нэмэх
7. **Database** → **Connect** → **Compass / Drivers** → connection string хуулах

Connection string иймэрхүү харагдана:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority
```

Энэ утгыг `.env`-ийн `DATABASE_URL`-д тавина.

---

## Telegram Bot тохируулах

### Bot үүсгэх

1. Telegram-д [@BotFather](https://t.me/BotFather) руу мессеж илгээх
2. `/newbot` гэж бич
3. Bot-ийн нэр болон username өгөх
4. `HTTP API token` хуулах → энэ нь `TELEGRAM_BOT_TOKEN`

### Chat ID авах

**Хувийн чат бол:**
1. [@userinfobot](https://t.me/userinfobot) руу `/start` илгээх
2. Таны `id` харагдана — энэ нь `TELEGRAM_CHAT_ID`

**Group/Channel бол:**
1. Bot-оо group-т нэмэх (admin болгох)
2. `https://api.telegram.org/bot<TOKEN>/getUpdates` хаягт хандах
3. `"chat":{"id": -XXXXXXXXX}` утгыг авах — энэ нь `TELEGRAM_CHAT_ID`

> Group болон channel-ийн ID ихэвчлэн сөрөг тоо байдаг (жишээ: `-1001234567890`).

---

## Vercel-д Deploy хийх

### 1. Vercel-д холбох

1. [https://vercel.com](https://vercel.com) руу нэвтрэх
2. **Add New Project** → GitHub репозитороо сонгох
3. Framework **Next.js** автоматаар таних

### 2. Environment Variables тохируулах

**Settings → Environment Variables** хэсэгт `.env` файлын бүх утгыг нэмнэ:

| Нэр | Утга |
|-----|------|
| `APP_URL` | `https://таны-domain.vercel.app` |
| `DATABASE_URL` | MongoDB Atlas connection string |
| `QPAY_ENABLED` | `true` |
| `QPAY_BASE_URL` | `https://merchant.qpay.mn` |
| `QPAY_USERNAME` | QPay нэвтрэх нэр |
| `QPAY_PASSWORD` | QPay нууц үг |
| `QPAY_INVOICE_CODE` | QPay invoice код |
| `QPAY_CALLBACK_SECRET` | Webhook нууц (санал болгоно) |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token |
| `TELEGRAM_CHAT_ID` | Telegram chat ID |
| `NEXT_PUBLIC_THEME` | `stone` (эсвэл өөр өнгө) |

### 3. Deploy хийх

**Deploy** товч дарна — Vercel автоматаар build хийж нийтэлнэ.

### 4. QPay Webhook тохируулах

Deploy амжилттай болсны дараа QPay merchant dashboard-д callback URL-г тохируулна:

```
https://таны-domain.vercel.app/api/qpay/callback
```

`QPAY_CALLBACK_SECRET` тохируулсан бол webhook request-д header нэмнэ:
```
Authorization: Bearer <нууц_утга>
```

---

## Төслийн бүтэц

```
├── app/
│   ├── api/
│   │   ├── donations/
│   │   │   ├── create/      # Хандив үүсгэх
│   │   │   ├── status/      # Төлбөрийн статус шалгах
│   │   │   └── recent/      # Сүүлийн хандивууд
│   │   └── qpay/
│   │       ├── callback/    # QPay webhook
│   │       └── token/       # QPay authentication
│   └── page.tsx             # Нүүр хуудас
├── components/
│   └── payment/             # Төлбөрийн UI компонентууд
├── lib/
│   ├── models/Donation.ts   # MongoDB схем
│   ├── qpay.ts              # QPay API wrapper
│   ├── telegram.ts          # Telegram мэдэгдэл
│   └── mongoose.ts          # Database холболт
└── .env.example             # Env хувьсагчдын загвар
```

---

## Лиценз

MIT
