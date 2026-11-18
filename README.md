# Panel de Gastos

Aplicación de finanzas personales para registrar ingresos y gastos, ver gráficos, controlar presupuestos por categoría y exportar los datos.

**Demo:** https://panel-gastos-liart.vercel.app (tocá "Cargar datos de ejemplo" para verlo completo)

<!-- Agregá una captura: guardala en docs/captura.png y descomentá la línea de abajo -->
<!-- ![Captura del panel](docs/captura.png) -->

## Funcionalidades

- **Movimientos:** alta, edición y baja de ingresos y gastos, con categoría, fecha y descripción.
- **Resumen mensual:** ingresos, gastos y saldo del mes elegido.
- **Filtros:** por mes, tipo y categoría, más un buscador.
- **Gráficos:** ingresos vs. gastos de los últimos 6 meses y gastos por categoría (Recharts).
- **Presupuestos:** límite mensual por categoría, con aviso al llegar al 80% y al pasarse.
- **Exportar a CSV:** compatible con Excel en español (separador `;`, coma decimal y acentos).
- **Cuentas de usuario:** registro e inicio de sesión con Supabase; cada usuario ve solo sus datos.
- **Modo invitado:** se puede probar sin cuenta; los datos quedan en el navegador.
- **Modo oscuro** y diseño adaptable a celular.

## Tecnologías

React 19 · TypeScript · Vite · Tailwind CSS 4 · Zustand · Recharts · Supabase (Auth + Postgres) · Vitest

## Decisiones técnicas

- **Capa de datos intercambiable:** la app habla con una interfaz `Repositorio` ([src/data/repositorio.ts](src/data/repositorio.ts)) que tiene dos implementaciones: una para `localStorage` y otra para Supabase. Así el mismo código funciona con o sin cuenta.
- **Seguridad en la base de datos:** las tablas usan Row Level Security ([supabase/schema.sql](supabase/schema.sql)), así que aunque alguien manipule el frontend, solo puede leer y modificar sus propias filas.
- **Lógica separada de la interfaz:** los cálculos (resumen, filtros, totales por mes, presupuestos) son funciones puras en [src/utils/calculos.ts](src/utils/calculos.ts), cubiertas por tests.
- **Gráficos accesibles:** paleta validada para daltonismo, y barras horizontales en lugar de torta para comparar muchas categorías.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:5173. Sin configurar nada, funciona en modo local.

### Tests

```bash
npm test
```

### Conectar Supabase (opcional)

1. Creá un proyecto gratis en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegá el contenido de [supabase/schema.sql](supabase/schema.sql) y ejecutalo.
3. En **Project Settings → API** copiá la *Project URL* y la *anon public key*.
4. Copiá `.env.example` como `.env.local` y completá esos dos valores.
5. Reiniciá `npm run dev`. Ahora la app pide iniciar sesión.

> Para probar rápido, en **Authentication → Providers → Email** podés desactivar *Confirm email*.

### Deploy en Vercel

1. Subí el repo a GitHub.
2. En [vercel.com](https://vercel.com), **Add New → Project** e importá el repo (Vercel detecta Vite solo).
3. Si usás Supabase, cargá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en **Environment Variables**.
4. En Supabase, en **Authentication → URL Configuration**, poné la URL de Vercel como *Site URL*.
