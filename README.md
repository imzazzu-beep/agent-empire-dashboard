# Agent Empire Dashboard UI

**Mission Control for your AI agent workforce**

## Status: 🚧 In Development

### ✅ Completed

- [x] Next.js 14 project initialized
- [x] Tailwind CSS configured
- [x] Supabase client set up
- [x] Dashboard home page (overview, stats, navigation)
- [x] Agents list page (view all agents)
- [x] Environment variables configured

### 🚧 In Progress

- [ ] Agent detail page (files, skills, tasks tabs)
- [ ] Create agent page (form + sessions_spawn integration)
- [ ] Tasks page (kanban board)
- [ ] Meetings page
- [ ] Files editor
- [ ] Skills library

## Quick Start

### Development Server

```bash
cd /root/.openclaw/workspace/agent-dashboard-ui
npm run dev
```

Then open: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State**: Zustand
- **Data Fetching**: TanStack React Query
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
agent-dashboard-ui/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard home
│   ├── agents/
│   │   ├── page.tsx        # Agents list
│   │   ├── [id]/page.tsx   # Agent detail (coming)
│   │   └── new/page.tsx    # Create agent (coming)
│   ├── tasks/              # Tasks pages (coming)
│   ├── meetings/           # Meetings pages (coming)
│   └── ...
├── lib/                    # Utilities
│   └── supabase.ts         # Supabase client
├── components/             # React components (coming)
└── ...
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for required variables.

## Next Steps

1. Build agent detail page
2. Build create agent form (integrates with sessions_spawn)
3. Build tasks kanban board
4. Build meetings scheduler
5. Build files editor (SOUL.md, MEMORY.md, etc.)
6. Build skills library

## Development Timeline

- **Phase 1** (Database): ✅ Complete
- **Phase 2** (Dashboard Home + Agents): ✅ 30% Complete
- **Phase 3** (Core Pages): 🚧 In Progress
- **Phase 4** (OpenClaw Integration): ⏳ Pending
- **Phase 5** (Advanced Features): ⏳ Pending

**ETA to MVP:** 1-2 days
