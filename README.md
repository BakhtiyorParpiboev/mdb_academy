# 🚀 Men Dasturchi Bo'laman

O'zbek tilidagi zamonaviy dasturlash o'rganish platformasi — interaktiv darslar, AI yordamchi, dasturlash o'yinlari va onlayn kompilyator bilan.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Express](https://img.shields.io/badge/Express-4-green?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)

---

## ✨ Xususiyatlar

- 📚 **Interaktiv Darslar** — HTML, CSS, JavaScript, Python va boshqalar
- 🤖 **AI Yordamchi** — Gemini AI bilan savol-javob va kod tahlili
- 🎮 **6 ta O'yin** — Viktorina, Bug Finder, Kod To'ldirish, Output Bashorat, Drag & Drop, Flashcard
- 💻 **Onlayn Kompilyator** — Python, JavaScript, C++, Java va boshqa tillarni brauzerda ishga tushiring
- 🔥 **Streak & XP Tizimi** — Kunlik streak, XP, darajalar, streak freeze
- 👤 **Profil Sahifasi** — Yutuqlar, faoliyat heatmap, portfolio loyihalar
- 🌙 **Qorong'u/Yorug' rejim** — Avtomatik tema almashtirish

---

## 🛠️ Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| **Frontend** | React 18, Vite, React Router, Lucide Icons |
| **Backend** | Express.js, Node.js |
| **Ma'lumotlar bazasi** | PostgreSQL + Prisma ORM |
| **Autentifikatsiya** | Firebase Authentication |
| **AI** | Google Gemini API |
| **Kompilyator** | Piston API |

---

## ⚡ Tez Boshlash

### Talablar

- Node.js 18+
- PostgreSQL
- Firebase loyihasi (autentifikatsiya uchun)
- Google Gemini API kaliti

### 1. Repozitoriyani klonlash

```bash
git clone https://github.com/BakhtiyorParpiboev/men-dasturchi-bo-laman.git
cd men-dasturchi-bo-laman
```

### 2. Backend sozlash

```bash
cd backend
npm install
```

`.env` faylini yarating:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mendasturchi"
GEMINI_API_KEY="your-gemini-api-key"
```

Ma'lumotlar bazasini sozlash:

```bash
npx prisma db push
```

Serverni ishga tushirish:

```bash
node server.js
```

Server `http://localhost:5000` da ishlaydi.

### 3. Frontend sozlash

```bash
cd ../frontend
npm install
```

`src/config/firebase.js` faylida Firebase konfiguratsiyangizni kiriting.

Frontend serverni ishga tushiring:

```bash
npm run dev
```

Sayt `http://localhost:5173` da ochiladi.

---

## 📁 Loyiha Tuzilishi

```
men-dasturchi-bo-laman/
├── backend/
│   ├── middleware/       # Auth middleware
│   ├── prisma/           # Database schema
│   ├── routes/           # API routes (auth, ai, compiler, streak, user, gamification)
│   └── server.js         # Express server
├── frontend/
│   ├── src/
│   │   ├── components/   # Header, Footer
│   │   ├── config/       # Firebase config
│   │   ├── context/      # Auth & Theme contexts
│   │   ├── pages/        # Home, Study, AI, Games, Compiler, Portfolio, Community
│   │   │   └── games/    # QuizGame, BugFinder, CodeCompletion, etc.
│   │   ├── index.css     # Global styles
│   │   └── App.jsx       # Routes
│   └── index.html
└── README.md
```

---

## 📝 API Endpointlar

| Metod | Yo'l | Tavsif |
|-------|------|--------|
| POST | `/api/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Kirish |
| GET | `/api/user/profile` | Profil ma'lumotlari |
| PUT | `/api/user/profile/update` | Profilni tahrirlash |
| GET | `/api/user/activity` | 90 kunlik faoliyat |
| GET | `/api/streak/status` | Streak holati |
| POST | `/api/streak/update` | Streakni yangilash |
| POST | `/api/streak/freeze` | Streak freeze |
| POST | `/api/compiler/run` | Kod ishga tushirish |
| POST | `/api/ai/chat` | AI bilan suhbat |

---

## 🤝 Hissa Qo'shish

1. Repozitoriyani fork qiling
2. Yangi branch yarating (`git checkout -b feature/yangi-funksiya`)
3. O'zgarishlarni commit qiling (`git commit -m 'Yangi funksiya qo'shildi'`)
4. Branch-ga push qiling (`git push origin feature/yangi-funksiya`)
5. Pull Request oching

---

## 📜 Litsenziya

Bu loyiha ochiq manbali hisoblanadi. Batafsil ma'lumot uchun [LICENSE](LICENSE) faylini ko'ring.

---

## 👨‍💻 Muallif

**Bakhtiyorjon Parpiboev**

- GitHub: [@BakhtiyorParpiboev](https://github.com/BakhtiyorParpiboev)
