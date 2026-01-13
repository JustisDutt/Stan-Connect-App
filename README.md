# Stan Connect

## Overview
Stan Connect is a class-based community mobile application designed for CSU Stanislaus students. The app enables students to join class spaces tied to their actual course schedule and collaborate through real-time discussion and shared resources in a secure, permission-aware environment.

Rather than relying on ad-hoc Discord servers or group chats for every class, Stan Connect provides a structured, semester-based system where class spaces are automatically defined and access is enforced at the database level.

This project is built to demonstrate production-oriented mobile system design: authenticated user flows, strict database authorization, real-time data handling, and scalable feature layering using Expo and Supabase.

---

## Problem Statement
Incoming and current university students often rely on fragmented group chats, outdated forums, or informal social platforms to coordinate class-related information. These solutions lack structure, consistency, and enforceable access control, and typically reset or disappear unpredictably.

Stan Connect addresses this gap by providing class-scoped spaces with:
- Verified student identities
- Explicit class membership
- Persistent, organized communication
- A foundation for shared academic resources

The goal is to remove setup friction while improving reliability and organization.

---

## System Architecture

High-level flow:
1. Users authenticate using a verified university email address.
2. Email verification and domain enforcement gate access to the app.
3. Users join their enrolled classes from a predefined class list.
4. Class membership is enforced at the database level using Row Level Security (RLS).
5. Class-scoped features (chat, resources) are unlocked based on membership.

Components:
- Mobile App: Expo React Native application
- Auth Layer: Supabase email authentication + verification
- Database: PostgreSQL with Row Level Security
- Realtime Layer: Supabase Realtime (chat implemented)
- Storage: Supabase Storage for class resources (in progress)

---

## Tech Stack

Mobile
- Expo (React Native, SDK 54)
- TypeScript
- React Navigation

Backend
- Supabase Auth
- PostgreSQL
- Row Level Security (RLS)
- Supabase Realtime
- Supabase Storage

Tooling & Infrastructure
- Git
- Expo Go
- Supabase SQL Editor
- Supabase Storage Buckets with RLS

---

## Scope and Constraints

In Scope
- Verified email authentication
- CSU Stanislaus domain enforcement (@csustan.edu)
- Persistent login sessions
- Class membership with database-level enforcement
- Real-time class chat
- Role-aware permissions for class resources
- Secure Supabase Storage access via RLS

Out of Scope (Current Phase)
- Public user discovery
- Anonymous access
- Push notifications
- University administrative access
- Monetization

These constraints are intentional to keep the project focused on correctness, security, and core collaboration workflows.

---

## Repository Structure

```
Stan-Connect-App/
├── mobile/
│   ├── src/
│   │   ├── auth/          # Authentication context and logic
│   │   ├── lib/           # Supabase client and data helpers
│   │   ├── navigation/    # App navigation configuration
│   │   └── screens/       # App screens (chat, classes, auth)
│   ├── assets/            # App icons and images
│   ├── app.json
│   └── package.json
├── supabase/
│   ├── schema.sql
│   ├── triggers.sql
│   └── rls.sql
├── docs/
│   └── Setup.md
└── README.md
```

---

## Running the Project Locally

Prerequisites
- Node.js 18+
- npm
- Expo CLI
- Supabase project

Mobile App
cd mobile
npm install
npx expo start

Open the app using Expo Go on iOS or Android.

Environment Variables

Create a .env file inside mobile/:

EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

Do not commit this file.

---

## Database Setup

All database definitions live in the supabase/ directory:

```
supabase/
├── schema.sql     # Core tables and relationships
├── triggers.sql   # Database triggers and helper functions
└── rls.sql        # Row Level Security policies
```

These files define:
- User profiles
- Classes
- Class membership
- Class resources
- Role-based permissions
- All Row Level Security policies

Run them in order using the Supabase SQL Editor.

---

## What This Project Demonstrates

- Secure, RLS-driven application design
- Explicit permission and role modeling
- Auth-gated navigation in a mobile app
- Real-time data handling with optimistic UI updates
- Clean separation between UI, auth, and data layers
- Production-minded Supabase usage (no service role keys on the client)

---

## Author
Justis Dutt  
Portfolio: https://www.justisdutt.com  
GitHub: https://github.com/JustisDutt  
LinkedIn: https://www.linkedin.com/in/justis-dutt-951834224/
