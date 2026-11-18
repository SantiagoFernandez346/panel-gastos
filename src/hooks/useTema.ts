import { useEffect, useState } from 'react'

export function useTema() {
  const [oscuro, setOscuro] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro)
    try {
      localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro')
    } catch {
      // Si el navegador bloquea localStorage, el tema simplemente no se recuerda
    }
  }, [oscuro])

  return { oscuro, alternar: () => setOscuro((o) => !o) }
}
