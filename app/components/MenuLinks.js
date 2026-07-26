'use client'

import Link from 'next/link'

const links = [
  { label: 'About', href: '/about' },
  { href: '/experience', label: 'Experience' },
  { href: '/porto', label: 'Portfolio' },
  { href: '/certificate', label: 'Certificate' },
]

export default function MenuLinks() {
  return (
    <div className="space-y-2">
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          <p className="text-gray-300 hover:text-black transition-colors duration-300 cursor-pointer text-xl font-press">
            &gt; {label}
          </p>
        </Link>
      ))}
    </div>
  )
}
