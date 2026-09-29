import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useParams } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import { Shell } from './components/Shell'
import { Home } from './pages/Home'
import { ListPage } from './pages/ListPage'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
import { Search } from './pages/Search'
import { Liked } from './pages/Liked'
import { applyPrefs, usePrefs } from './lib/store'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })

/** `/@handle` is matched through a single dynamic segment. */
function Seg() {
  const { seg = '' } = useParams()
  if (seg.startsWith('@') && seg.length > 1) return <Profile key={seg} handle={seg.slice(1)} />
  return <div className="grid h-[70dvh] place-items-center text-6xl text-muted/40">404</div>
}

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/liked', element: <Liked /> },
      { path: '/settings', element: <Settings /> },
      { path: '/l/:id', element: <ListPage /> },
      { path: '/:seg', element: <Seg /> },
    ],
  },
])

function Prefs() {
  const { theme, lang } = usePrefs()
  useEffect(() => {
    applyPrefs(theme, lang)
    if (theme !== 'system') return
    const m = matchMedia('(prefers-color-scheme: dark)')
    const f = () => applyPrefs(theme, lang)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [theme, lang])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <Prefs />
      <RouterProvider router={router} />
      <Toaster position="top-center" toastOptions={{ className: '!rounded-full !border-line !bg-card !text-fg !shadow-xl' }} />
    </QueryClientProvider>
  </StrictMode>,
)
