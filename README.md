# Restaurant Menu + Online Ordering System for Lahore

A complete digital solution for restaurants in Lahore to manage their menu, accept online orders, and provide a seamless customer experience with QR codes, WhatsApp ordering, and in-app order management.

## Prerequisites

1. **Node.js 18+** installed
2. **Supabase account** - Create one at [supabase.com](https://supabase.com)
3. **Supabase project** with the database schema set up (see Database Setup below)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the "Project URL" and "anon/public" key

### 3. Database Setup

Run the SQL schema provided in the Supabase SQL editor. This includes:
- User profiles and authentication
- Restaurants and branches
- Menu categories and items
- Orders and order items
- Promotions and loyalty
- QR codes and analytics

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/supabase/` - Supabase client configuration
- `app/api/` - API routes for QR generation, payments, analytics

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
