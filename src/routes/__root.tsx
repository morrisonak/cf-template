/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { UserNav } from '~/components/UserNav'
import { ThemeProvider } from '~/components/theme-provider'
import { ThemeToggle } from '~/components/theme-toggle'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

// Script to prevent flash of unstyled content
const themeScript = `
  (function() {
    const stored = localStorage.getItem('cf-template-theme');
    const theme = stored || 'system';
    const root = document.documentElement;

    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    }
  })();
`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'CF Template | TanStack Start + Cloudflare',
        description: 'Full-stack template with TanStack Start, Shadcn UI, Cloudflare Workers, D1, and R2',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        children: themeScript,
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cf-template-theme">
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between text-sm">
            <div className="flex gap-4">
              <Link
                to="/"
                className="font-semibold hover:text-primary"
                activeProps={{ className: 'text-primary' }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                About
              </Link>
              <Link
                to="/posts"
                className="hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                Posts
              </Link>
              <Link
                to="/files"
                className="hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                Files
              </Link>
              <Link
                to="/settings"
                className="hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                Settings
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
