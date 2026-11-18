-- Tablas del Panel de Gastos.
-- Pegá este archivo completo en Supabase → SQL Editor → New query → Run.

-- Movimientos (ingresos y gastos)
create table if not exists public.movimientos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tipo        text not null check (tipo in ('ingreso', 'gasto')),
  monto       numeric(14, 2) not null check (monto > 0),
  categoria   text not null,
  fecha       date not null,
  descripcion text not null default '',
  creado_en   timestamptz not null default now()
);

create index if not exists movimientos_user_fecha_idx on public.movimientos (user_id, fecha desc);

-- Presupuestos mensuales por categoría (uno por categoría y usuario)
create table if not exists public.presupuestos (
  user_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  categoria text not null,
  monto     numeric(14, 2) not null check (monto > 0),
  primary key (user_id, categoria)
);

-- Row Level Security: cada usuario solo puede leer y modificar sus propias filas
alter table public.movimientos enable row level security;
alter table public.presupuestos enable row level security;

drop policy if exists "Cada usuario maneja sus movimientos" on public.movimientos;
create policy "Cada usuario maneja sus movimientos"
  on public.movimientos for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Cada usuario maneja sus presupuestos" on public.presupuestos;
create policy "Cada usuario maneja sus presupuestos"
  on public.presupuestos for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
