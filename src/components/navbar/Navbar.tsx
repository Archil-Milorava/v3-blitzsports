'use client'

import { useAuthSession } from '@/src/hooks/use-auth-session'
import { authClient } from '@/src/lib/auth-client'
import { Avatar, Chip, toast, Tooltip } from '@heroui/react'
import { LogIn, LogOutIcon, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { name: 'ფოოტბალლ', href: '/football' },
  { name: 'MMA', href: '/mma' },
  { name: 'ფორმულა 1', href: '/f1' },
  { name: 'სხვა', href: '/other' },
]

function isCategoryPathActive(pathname: string | null, href: string) {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, isPending: sessionPending, session } = useAuthSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const closeNavbar = () => setIsOpen(false)

  async function handleSignOut() {
    try {
      await authClient.signOut()
      closeNavbar()
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        toast.danger(error.message)
      }
    }
  }

  return (
    <nav className="bg-default-foreground sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-6 shadow-lg lg:px-12">
      {/* LEFT: Logo */}
      <Link
        href="/"
        className="group flex items-center justify-center rounded-xl px-4 py-2 transition-all duration-300"
      >
        <span className="text-accent bg-accent-second text-2xl font-extrabold tracking-wider transition-all hover:opacity-80">
          BLITZ
        </span>
      </Link>

      {/* MIDDLE: Desktop Links */}
      <div className="hidden items-center gap-6 md:flex">
        {navLinks.map((link) => {
          const active = isCategoryPathActive(pathname, link.href)
          return (
            <Link
              key={link.name}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`text-sm font-semibold transition-colors ${
                active
                  ? 'border-accent text-accent border-b-2 pb-0.5'
                  : 'text-accent-foreground hover:text-accent border-b-2 border-transparent pb-0.5'
              }`}
            >
              {link.name}
            </Link>
          )
        })}
      </div>

      {/* RIGHT: Desktop Avatar / Auth */}
      <div className="hidden md:block">
        {sessionPending ? (
          <div className="h-10 w-10 animate-pulse rounded-full" />
        ) : user ? (
          <Link
            href="/profile"
            className="hover:border-accent block rounded-full border-2 border-transparent p-1 transition-all"
          >
            <Avatar>
              <Avatar.Image
                alt={user.name ?? 'User'}
                src={user.image ?? ''}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <Avatar.Fallback>{user.name?.charAt(0).toUpperCase() ?? 'B'}</Avatar.Fallback>
            </Avatar>
          </Link>
        ) : (
          <Link
            href="/auth"
            className="text-accent-foreground hover:text-accent flex items-center gap-1 rounded-2xl px-2 py-1 text-xs tracking-wider"
          >
            ავტორიზაცია
            <LogIn size={15} />
          </Link>
        )}
      </div>

      {/* MOBILE: Hamburger Icon */}
      <button
        className="text-accent-foreground cursor-pointer p-2 transition-all hover:opacity-60 md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* MOBILE OVERLAY DRAWER */}
      <div
        className={`bg-background fixed inset-0 z-50 flex transform flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        {/* Top bar */}
        <div className="bg-default-foreground flex h-16 w-full items-center justify-between border-b px-10">
          <Link
            href="/"
            className="text-accent bg-accent-second text-2xl font-extrabold tracking-wider transition-all hover:opacity-80"
            onClick={closeNavbar}
          >
            BLITZ
          </Link>
          <button
            className="text-accent-foreground cursor-pointer p-2 transition-all hover:opacity-60"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Nav links */}
        <ul className="items-cente justify- flex flex-1 flex-col gap-6 overflow-y-auto px-10 py-5">
          {navLinks.map((item) => {
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeNavbar}
                  className={`text-accent block text-sm font-semibold transition-colors hover:opacity-70`}
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Bottom bar */}
        <div className="bg-surface flex h-16 w-full items-center justify-between border-t px-10">
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-2 transition-all hover:opacity-80"
            onClick={closeNavbar}
          >
            {user && (
              <Avatar>
                <Avatar.Image
                  alt={user.name ?? 'User'}
                  src={user.image ?? ''}
                  referrerPolicy="no-referrer"
                />
                <Avatar.Fallback>{user.name?.charAt(0).toUpperCase() ?? 'B'}</Avatar.Fallback>
              </Avatar>
            )}
            {user?.name && <span className="text-sm font-medium">{user.name}</span>}
          </Link>

          {user ? (
            <Tooltip delay={0}>
              <Tooltip.Trigger aria-label="Status chip">
                <Chip
                  color="danger"
                  className="cursor-pointer p-2 hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSignOut()
                  }}
                >
                  <LogOutIcon width={20} />
                </Chip>
              </Tooltip.Trigger>
              <Tooltip.Content className="flex items-center gap-1.5">
                <p>ანგარიშიდან გამოსვლა</p>
              </Tooltip.Content>
            </Tooltip>
          ) : (
            <Link
              href="/auth"
              className="hover:text-accent flex cursor-pointer items-center gap-1 rounded-2xl px-2 py-1 text-xs tracking-wider transition-all"
            >
              ავტორიზაცია
              <LogIn size={15} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
