'use client'

import Image from 'next/image'


export default function SocialLinks({ links = [] }) {
  return (
    <ul className="flex gap-2 items-center mt-2">
      {links.map(({ href, icon, alt }) => (
        <li key={href} className="w-6 h-6">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            download={href.endsWith('.pdf')}
          >
            <Image
              src={icon}
              alt={alt}
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
