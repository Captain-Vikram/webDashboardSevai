# Sevai Web Dashboard# Sevai Web Dashboard

Financial wellness dashboard with real-time transaction tracking, habit insights, and streak-based theming.Financial wellness dashboard with real-time transaction tracking, habit insights, and coaching.

## 🚀 Quick Start## 🚀 Quick Start

`bash`bash

# Install dependencies# Install dependencies

npm install

# Generate Prisma client# Generate Prisma client

npx prisma generatenpx prisma generate

# Start development server# Start development server

npm run devnpm run dev

````



Open **http://localhost:3000?userId=2**Open **http://localhost:3000?userId=2**



------



## 📊 Features## 📊 Features



- ✅ **Real-time Transaction Tracking** - Live data from PostgreSQL- ✅ **Real-time Transaction Tracking** - Live data from PostgreSQL

- ✅ **Smart Streak Counter** - Tracks consecutive transaction days with flame animations- ✅ **Smart Streak Counter** - Tracks consecutive transaction days

- ✅ **Dynamic Theming** - 9 themes that change based on streak (0 → 700+ days)- ✅ **Category Breakdown** - Spending visualization (weekly/monthly/all-time)

- ✅ **Category Breakdown** - Spending visualization (weekly/monthly/all-time)- ✅ **Transaction Heatmap** - Calendar view of activity

- ✅ **Transaction Heatmap** - Calendar view of activity- ✅ **Habit Insights** - Financial habit tracking

- ✅ **Animated Charts** - Smooth Framer Motion animations- ✅ **Coach Advice** - Personalized recommendations

- ✅ **Habit Insights** - Financial habit tracking

- ✅ **Coach Advice** - Personalized recommendations---



---## 🔌 API Usage



## 🔌 API Reference### Get Dashboard Data



### Get Dashboard Data```bash

GET /api/dashboard?userId=2

```bash```

GET /api/dashboard?userId=2

```### Sync Data to JSON Cache



Returns real-time data from PostgreSQL database.```bash

GET /api/dashboard?userId=2&sync=true

**Response Structure:**```

```json

{### Sync Utility Script

  "metadata": {

    "version": "1.1",```bash

    "generatedAt": "2025-11-08T10:30:45.123Z",node scripts/sync.mjs 2

    "currency": "INR"```

  },

  "user": {---

    "id": 2,

    "name": "Vighnesh",## 📁 Key Files

    "whatsappNumber": "919619183585"

  },```

  "account": {lib/

    "currentStreak": 500,├── db.ts                    # Prisma client

    "balance": {├── dashboard-service.ts     # Data fetching

      "opening": 500,└── sync-dashboard-data.ts   # JSON sync

      "current": 500,

      "maxEverReached": 500pages/

    }├── index.tsx                # Dashboard page

  },└── api/dashboard.ts         # API endpoint

  "transactions": {

    "summary": { ... },components/ui/

    "categoryBreakdown": { ... }├── pie-chart-with-legend.tsx

  }├── transaction-heatmap.tsx

}└── streak-fire-element.tsx

```

public/

### Sync Data to JSON Cache└── dashboard-data.json      # Cached data

```

```bash

GET /api/dashboard?userId=2&sync=true---

```

## 🗄️ Database

Fetches from DB and saves to `public/dashboard-data.json`.

PostgreSQL + Prisma ORM

### Sync Utility Script

**Tables**: `users`, `tranasctions`, `habit_insights`, `coach_briefings`

```bash

node scripts/sync.mjs 2---

```

## 🛠️ Tech Stack

Standalone script to sync data for a specific user.

- Next.js 13 + React 18 + TypeScript

---- Recharts + Motion/React

- PostgreSQL + Prisma

## 🎨 Theme System- Tailwind CSS



Dashboard theme automatically changes based on current streak:---



| Streak Days | Theme          | Flame Color | Font Family                   |## 📖 Documentation

|-------------|----------------|-------------|-------------------------------|

| 0           | Graphite       | Dead 💀     | Inter / Georgia / Fira Code   |See **[API_DOCS.md](./API_DOCS.md)** for complete API reference.

| 1-100       | Elegant Luxury | Red 🔴      | Poppins / Libre Baskerville   |

| 101-200     | Amber Minimal  | Orange 🟠   | Work Sans / Lora              |---

| 201-300     | Bold Tech      | Yellow 🟡   | Space Grotesk / Merriweather  |

| 301-400     | Nature         | Green 🟢    | Plus Jakarta Sans             |**Status**: ✅ Production Ready

| 401-400     | Vercel         | White ⚪     | Geist Sans                    |
| 501-600     | Quantum Rose   | Blue 🔵     | DM Sans / Playfair Display    |
| 601-700     | Mono           | Indigo 🟣   | JetBrains Mono                |
| 701+        | Mono           | Violet 🟣   | JetBrains Mono                |

Theme colors from [tweakcn.com](https://tweakcn.com/r/themes/) installed via shadcn CLI.

---

## 📁 Project Structure

```
lib/
├── db.ts                      # Prisma client singleton
├── dashboard-service.ts       # Data fetching logic
├── sync-dashboard-data.ts     # JSON cache sync
├── theme-generator.ts         # Streak-based theme system
└── utils.ts                   # Tailwind helpers

pages/
├── _app.tsx                   # Theme application + Google Fonts
├── index.tsx                  # Dashboard page
└── api/dashboard.ts           # API endpoint

components/ui/
├── pie-chart-with-legend.tsx  # Main dashboard component
├── credit-debit-chart.tsx     # Transaction trend chart
├── transaction-heatmap.tsx    # Calendar heatmap
├── streak-fire-element.tsx    # Animated flame counter
├── dashboard-overview-slider.tsx # Tips carousel
├── increase-size-pie-chart.tsx   # Animated pie chart
├── animated-counter.tsx       # Number animations
├── card.tsx                   # shadcn card
└── chart.tsx                  # Recharts wrapper

public/
└── dashboard-data.json        # Cached dashboard data

scripts/
└── sync.mjs                   # Standalone sync script

styles/
├── globals.css                # Theme CSS variables
└── streak-fire-element.css    # Flame animations
```

---

## 🗄️ Database

**Stack:** PostgreSQL + Prisma ORM

**Tables:**
- `users` - User profiles (name, phone, balance)
- `tranasctions` - All transactions (note: spelled "tranasctions" in DB)
- `habit_insights` - Financial habit tracking data
- `coach_briefings` - Personalized coaching advice

**Schema Location:** `schema.prisma`

---

## 🛠️ Tech Stack

- **Framework:** Next.js 13.5.11 (Pages Router)
- **Language:** TypeScript 5.6.3
- **Database:** PostgreSQL + Prisma 6.0.1
- **Styling:** Tailwind CSS + shadcn/ui
- **Charts:** Recharts 2.14.1
- **Animations:** Framer Motion (motion/react)
- **Icons:** Lucide React

---

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Sync data for user 2
node scripts/sync.mjs 2

# Generate Prisma client (after schema changes)
npx prisma generate

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## ⚙️ Environment Variables

Create `.env` file in root:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
DEV_USER_ID=2
JWT_SECRET=your-secret-key
```

---

## 🧪 Data Flow

1. **Page Load** → `_app.tsx` fetches `/dashboard-data.json`
2. **Theme Applied** → Based on `account.currentStreak` value
3. **Component Render** → `pie-chart-with-legend.tsx` loads data
4. **Dual Source Logic:**
   - Primary: `/api/dashboard?userId=X` (live data)
   - Fallback: `/dashboard-data.json` (cached)

---

## 🐛 Troubleshooting

### API Not Working?

- Ensure dev server is running: `npm run dev`
- Check `DATABASE_URL` in `.env`
- Regenerate Prisma: `npx prisma generate`

### Data Not Updating?

- Manual sync: `node scripts/sync.mjs 2`
- API sync: `http://localhost:3000/api/dashboard?userId=2&sync=true`
- Check console for errors (F12)

### Theme Not Changing?

- Hard refresh browser: `Ctrl + Shift + R`
- Check console for: `🔥 Streak: X days → Theme: Y`
- Verify `account.currentStreak` in JSON
- Clear Next.js cache: `Remove-Item -Recurse -Force .next`

### Prisma Errors?

- Regenerate client: `npx prisma generate`
- Check connection: `npx prisma db pull`
- Update schema: `npx prisma db push`

---

## 📦 Component Usage

### Frontend Usage

Components automatically fetch data with dual-source logic:

```typescript
// Tries API first, falls back to JSON
const response = await fetch(`/api/dashboard?userId=${userId}`);
```

### Accessing Dashboard

```bash
# User ID 2 (Vighnesh)
http://localhost:3000?userId=2

# Other users
http://localhost:3000?userId={ID}
```

---

## 🚀 Deployment

1. **Build project:**
   ```bash
   npm run build
   ```

2. **Set environment variables** on hosting platform

3. **Deploy** to Vercel/Netlify/Railway

4. **Setup cron job** for data sync:
   ```bash
   curl "https://yourdomain.com/api/dashboard?userId=2&sync=true"
   ```

---

## 📝 Recent Updates

- ✅ **v1.1** - Streak-based dynamic theming (9 themes)
- ✅ Streamlined theme system (477 → 53 lines, 90% reduction)
- ✅ Fixed JSON data path bug in `_app.tsx`
- ✅ Smooth 700ms animations on tip cards
- ✅ Typography updates for all themes
- ✅ Cleaned unused files and dependencies

---

**Status:** ✅ Production Ready
**Version:** 1.1
**Last Updated:** November 8, 2025
````
