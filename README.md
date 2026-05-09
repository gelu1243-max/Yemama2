# yemama - Pregnancy & Period Tracker

A beautiful, compassionate health tracking app for women to monitor their pregnancy journeys and menstrual cycles. Built with Next.js 16, Supabase, and Tailwind CSS.

## Features

### Authentication & Onboarding
- Secure email/password authentication via Supabase
- Personalized onboarding flow
- Choose between period tracking or pregnancy tracking
- Customizable cycle preferences

### Dashboard
- Beautiful health tracking cards (Heart Rate, Glucose, BP, Steps, Sleep, Diet)
- Quick access to main features
- Mother-child illustrations on every section
- Responsive grid layout with gradient cards

### Calendar
- Monthly calendar view with cycle phase tracking
- Color-coded phases: Period (red), Fertile (pink), Ovulation (purple), Luteal (blue)
- Cycle statistics and insights
- Illustrated cycle phases with legend

### Pregnancy Tracking
- Current week display with baby development info
- Baby weight and height tracking
- Mother's health monitoring
- Due date countdown
- Progress visualization
- Fetal development illustrations

### Health Metrics
Individual tracking pages for:
- Heart Rate (PR Tracker)
- Blood Pressure (BP)
- Blood Glucose
- Steps/Activity
- Sleep Duration
- Nutrition/Diet

### Educational Content
- Prenatal nutrition guides
- Pregnancy exercise routines
- Cycle education
- Mental health resources
- Course filtering by category
- Illustrated educational materials

### Profile Management
- User profile settings
- Cycle/pregnancy preferences
- Health statistics
- Account management
- Sign out functionality

## Design

### Color Scheme
- **Primary**: Magenta/Pink (#E91E8C equivalent)
- **Secondary**: Purple (#8B5CF6)
- **Accents**: Coral, Teal
- **Background**: Soft pastels (cream, light pink, light blue)

### Illustrations
Mother and child illustrations integrated throughout:
- Dashboard hero illustration
- Calendar phase visualization
- Pregnancy development stages
- Health tracking guidance
- Educational course covers
- Profile relationship illustration

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Images**: Next.js Image component
- **Icons**: Lucide React

## Project Structure

```
/app
  /auth
    - login/page.tsx
    - signup/page.tsx
    - onboarding/page.tsx
  /dashboard/page.tsx
  /calendar/page.tsx
  /pregnancy/page.tsx
  /profile/page.tsx
  /education/page.tsx
  /tracking
    - heart/page.tsx
    - glucose/page.tsx
    - bp/page.tsx
    - steps/page.tsx
    - sleep/page.tsx
    - diet/page.tsx
  - layout.tsx
  - page.tsx

/lib
  - types.ts
  - supabase/
    - client.ts
    - server.ts
    - schema.sql

/public/images
  - mother-child-dashboard.jpg
  - mother-health-tracking.jpg
  - cycle-calendar.jpg
  - pregnancy-development.jpg
  - education-nutrition.jpg
  - education-exercise.jpg
  - symptoms-tracking.jpg
  - profile-mother.jpg

/components/ui
  - [shadcn/ui components]
```

## Database Schema

### Tables
1. **user_profiles** - User tracking preferences and metadata
2. **cycle_logs** - Period and cycle phase tracking
3. **pregnancy_data** - Pregnancy information and milestones
4. **health_metrics** - Daily health data (heart rate, BP, glucose, steps, sleep)
5. **symptoms** - Symptom logging with intensity tracking
6. **educational_content** - Educational articles and courses

### Security
- Row-level security (RLS) enabled on all tables
- Users can only access their own data
- Educational content is publicly readable

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account

### Environment Variables
Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up Supabase schema:
   - Go to Supabase dashboard
   - Run the SQL from `lib/supabase/schema.sql`

3. Start development server:
```bash
pnpm dev
```

4. Open http://localhost:3000

## Deployment

The app is ready to deploy to Vercel:

```bash
vercel deploy
```

Make sure to add environment variables in Vercel project settings.

## Key Features Implemented

✅ Full authentication system with email/password
✅ Cycle tracking with calendar visualization
✅ Pregnancy progress monitoring
✅ Health metrics dashboard
✅ Educational content library
✅ Mother-child illustrations on every page
✅ Responsive mobile-first design
✅ Bottom navigation for easy access
✅ User profile management
✅ Real-time data syncing with Supabase

## Future Enhancements

- Push notifications for cycle predictions
- Data export (PDF, CSV)
- Social features (share progress with partner)
- AI-powered health insights
- Wearable integration (Apple Watch, Fitbit)
- Dark mode toggle
- Multi-language support
- Community forum

## License

MIT

## Brand Name

**yemama** - Your compassionate companion for pregnancy and period tracking
