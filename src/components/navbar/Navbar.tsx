'use client'

import { Avatar } from '@heroui/react'
import { LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { name: 'ფეხბურთი', href: '/football' },
  { name: 'MMA', href: '/mma' },
  { name: 'ფორმულა 1', href: '/formula-1' },
  { name: 'სხვა', href: '/other' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <nav className="bg-surface sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-6 lg:px-12">
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
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-foreground hover:text-accent text-sm font-semibold transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* RIGHT: Desktop Avatar */}
      <div className="hidden md:block">
        <Link
          href="/profile"
          className="block rounded-full border-2 border-transparent p-1 transition-all hover:border-(--accent)"
        >
          <Avatar>
            <Avatar.Image
              alt="John Doe"
              src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
            />
            <Avatar.Fallback>JD</Avatar.Fallback>
          </Avatar>
        </Link>
      </div>

      {/* MOBILE: Hamburger Icon */}
      <button
        className="text-foreground cursor-pointer p-2 transition-all hover:opacity-60 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={28} />
      </button>

      {/* MOBILE OVERLAY DRAWER */}
      <div
        className={`bg-background fixed inset-0 z-50 flex transform flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        {/* top */}
        <div className="bg-surface flex h-1/12 w-full items-center justify-between border-b px-10">
          <span className="text-accent bg-accent-second text-2xl font-extrabold tracking-wider transition-all hover:opacity-80">
            BLITZ
          </span>
          <button
            className="text-foreground cursor-pointer p-2 transition-all hover:opacity-60 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={28} />
          </button>
        </div>
        {/* MIDDLE */}
        <ul className="flex flex-1 flex-col items-center gap-4 overflow-x-hidden overflow-y-scroll px-10 py-5">
          {navLinks.map((item) => (
            <Link
              className="hover:text-accent text- font-semibold transition-all"
              href={item.href}
              key={item.href}
            >
              {item.name}
            </Link>
          ))}
        </ul>
        {/* bottom */}
        <div className="bg-surface flex h-1/12 w-full items-center justify-between px-10">
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-2 transition-all hover:opacity-80"
          >
            <Avatar>
              <Avatar.Image
                alt="John Doe"
                src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
              />
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
            <h1>archil milorava</h1>
          </Link>
          <button className="text-foreground hover:text-danger cursor-pointer p-2 transition-all md:hidden">
            <LogOut size={28} />
          </button>
        </div>
      </div>
    </nav>
  )
}
