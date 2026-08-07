import './styles/globals.css'
import { Press_Start_2P, Outfit } from 'next/font/google'
import Loader from './components/Loader'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pressStart',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata = {
  metadataBase: new URL('https://duta1.com'),
  title: {
    default: 'Duta Alamin | Software Engineer & ERP Consultant',
    template: '%s | Duta Alamin',
  },
  description: 'Duta Alamin - Software Engineer, Automation Engineer & ERP Consultant. Explore my digital quests and projects!',
  keywords: [
    'Duta Alamin',
    'Software Engineer',
    'Automation Engineer',
    'ERP Consultant',
    'Portfolio',
    'Indonesia Developer',
    'Next.js Portfolio',
  ],
  authors: [{ name: 'Duta Alamin' }],
  creator: 'Duta Alamin',
  openGraph: {
    title: 'Duta Alamin | Software Engineer & ERP Consultant',
    description: 'Duta Alamin - Software Engineer, Automation Engineer & ERP Consultant. Explore my digital quests and projects!',
    url: 'https://duta1.com',
    siteName: 'Duta Alamin Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duta Alamin | Software Engineer & ERP Consultant',
    description: 'Duta Alamin - Software Engineer, Automation Engineer & ERP Consultant. Explore my digital quests and projects!',
  },
  icons: {
    icon: '/images/duta.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import ClickSoundProvider from './components/ClickSoundProvider'
import DisableZoom from './components/DisableZoom'
import CustomCursor from './components/CustomCursor'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${outfit.variable}`}>
      <body>
        <DisableZoom />
        <CustomCursor />
        <ClickSoundProvider>
          <Loader />
          {children}
        </ClickSoundProvider>
      </body>
    </html>
  )
}
