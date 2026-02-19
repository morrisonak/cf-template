import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              to="/posts"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
            >
              Posts
            </Link>
            <Link
              to="/files"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
            >
              Files
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
            >
              Settings
            </Link>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
