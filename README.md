# CRM Enquiry Management System

A responsive CRM system for managing customer enquiries, built with Next.js, Tailwind CSS, and Supabase.

## Features

- User authentication (Amit and Prateek)
- Dashboard with user-specific views
- Enquiry management with the following fields:
  - Date
  - Segment (Agri, Corporate, Others)
  - Customer Name (with auto-fetch functionality)
  - Phone Number
  - Location
  - Details of Requirement
  - Status (Lead, Enquiry, Quote, Won, Loss) with color coding
  - Remarks
  - Auto Reminder date
- Customer management
- Responsive design for mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase/schema.sql` and run it in the SQL Editor
4. Go to Authentication > Settings and enable Email/Password sign-in method
5. Create users for Amit and Prateek in the Authentication > Users section
6. Get your Supabase URL and anon key from the API settings

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Update the `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Log in with the credentials for either Amit or Prateek
2. Select the user on the dashboard
3. Navigate to the Enquiries section to create and manage enquiries
4. Use the Customers section to view customer information and their enquiry history

## Mobile Usage

The application is fully responsive and can be used on mobile devices. The layout will adapt to smaller screens, making it easy to manage enquiries on the go.

## Production Deployment

This project can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications. You can also deploy it to a traditional hosting service using a Node.js server.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create an optimized production build in the `.next` directory.

To start the production server:

```bash
npm start
```

The application will be available at http://localhost:3000 (or the port specified in your environment variables).

### Deploying to Vercel (Recommended)

Vercel is the easiest platform to deploy Next.js applications:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign up or log in
3. Click "New Project" and import your GitHub repository
4. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

Vercel will automatically build and deploy your application. Each time you push changes to your repository, Vercel will automatically redeploy your application.

### Deploying to Netlify

1. Push your code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and sign up or log in
3. Click "New site from Git" and select your GitHub repository
4. Set the build command to `npm run build`
5. Set the publish directory to `.next`
6. Add your environment variables in the "Advanced build settings" section
7. Click "Deploy site"

### Deploying to a Traditional Hosting Service

1. Build the application on your local machine:
   ```bash
   npm run build
   ```
2. Transfer the following files and directories to your server:
   - `.next/`
   - `public/`
   - `package.json`
   - `package-lock.json` (or `yarn.lock`)
   - `.env.production` (rename to `.env` on the server)
3. On your server, install the production dependencies:
   ```bash
   npm install --production
   ```
4. Start the production server:
   ```bash
   npm start
   ```

### Using Docker for Deployment

You can also use Docker to containerize your application:

1. Create a Dockerfile in the root of your project:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. Build and run your Docker container:
```bash
docker build -t crm-app .
docker run -p 3000:3000 crm-app
```

### Important Production Considerations

1. **Security**: Ensure your Supabase security rules are properly configured for production
2. **Backups**: Set up regular database backups in Supabase
3. **Monitoring**: Consider adding monitoring tools like Sentry for error tracking
4. **Performance**: Enable caching where appropriate for better performance
5. **SSL**: Ensure your deployment has SSL enabled for secure connections
# gdccrm
