import './styles/globals.css'
import { Press_Start_2P } from 'next/font/google'
import Loader from './components/Loader'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pressStart',
})

export const metadata = {
  title: 'Duta Alamin | Software Engineer & ERP Consultant',
  description: 'Duta Alamin - Software Engineer, Automation Engineer & ERP Consultant. Explore my digital quests and projects!',
  openGraph: {
    title: 'Duta Alamin | Software Engineer & ERP Consultant',
    description: 'Duta Alamin - Software Engineer, Automation Engineer & ERP Consultant. Explore my digital quests and projects!',
    url: 'https://duta1.com',
    siteName: 'Duta Alamin Portfolio',
    type: 'website',
  },
  icons: {
    icon: '/images/duta.png',
  },
}

import ClickSoundProvider from './components/ClickSoundProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={pressStart.variable}>
      <body>
        <ClickSoundProvider>
          <Loader />
          {children}
        </ClickSoundProvider>
      </body>
    </html>
  )
}
