
create table profiles (
  id uuid primary key references auth.users(id),
  email text not null,
  created_at timestamptz default now()
);
