# Stan Connect

## Overview
Stan Connect is a class-based community mobile application designed for CSU Stanislaus students. The app enables students to join class spaces using invite codes and collaborate through discussion, shared resources, and reminders in a secure, permission-aware environment.

This project is built to demonstrate production-oriented mobile system design: authenticated user flows, strict database authorization, structured navigation, and scalable feature layering using Expo and Supabase.

---

## Problem Statement
Incoming and current university students often rely on fragmented group chats, outdated forums, or informal social platforms to coordinate class-related information. These solutions lack structure, persistence, and access control.

Stan Connect addresses this gap by providing **class-scoped spaces** with enforced membership, verified identities, and a foundation for real-time collaboration — designed with security and maintainability as first-class concerns.

---

## System Architecture

**High-level flow:**
1. Users authenticate using verified university email addresses.
2. Auth state gates access to the application.
3. Users join classes explicitly via invite codes.
4. Class membership is enforced at the database level using RLS.
5. Class-scoped features (chat, resources, reminders) build on this membership model.

**Components:**
- **Mobile App:** Expo React Native application
- **Auth Layer:** Supabase email authentication + verification
- **Database:** PostgreSQL with Row Level Security
- **Realtime Layer:** Supabase Realtime (planned)
- **Storage:** Supabase Storage for class resources (planned)

---

## Tech Stack

**Mobile**
- Expo (React Native, SDK 54)
- TypeScript
- React Navigation

**Backend**
- Supabase Auth
- PostgreSQL
- Row Level Security (RLS)

**Tooling & Infrastructure**
- Git
- Expo Go
- SQL migrations via Supabase SQL Editor

---

## Scope and Constraints

**In Scope**
- Verified email authentication
- CSU Stanislaus domain enforcement
- Persistent sessions
- Class membership via join codes
- Database-enforced authorization
- Scalable navigation architecture

**Out of Scope**
- Public user discovery
- Anonymous access
- Cloud deployment hardening
- Push notifications
- Monetization

These constraints are intentional to keep the project focused on correctness, security, and core collaboration workflows.

---

## Repository Structure

```
Stan_Connect_App/
├── mobile/        # Expo React Native application
├── supabase/      # Database schema, triggers, and RLS policies
├── docs/          # Architecture and planning documents
└── README.md
```

---

## Running the Project Locally

### Mobile App
```bash
cd mobile
npm install
npx expo start
```

Open the app using **Expo Go** on iOS or Android.

---

## Database Setup

All database definitions live in the `supabase/` directory:

```
supabase/
├── schema.sql
├── triggers.sql
├── rls.sql
```

These files define:
- User profiles
- Classes
- Class membership
- All Row Level Security policies

Run them in order using the Supabase SQL Editor.

---

## What This Project Demonstrates

- Secure, RLS-driven application design
- Explicit permission modeling
- Auth-first mobile architecture
- Clean separation between UI, auth, and data layers
- Production-minded Supabase usage (no service keys on client)

---

## Author
**Justis Dutt**  
- Portfolio: https://www.justisdutt.com  
- GitHub: https://github.com/JustisDutt  
- LinkedIn: https://www.linkedin.com/in/justis-dutt-951834224/

---
