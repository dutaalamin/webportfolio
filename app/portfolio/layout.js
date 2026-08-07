// Server component layout — provides per-route metadata only.

export const metadata = {
  title: 'Portfolio',
  description:
    'Browse Duta Alamin\'s project collection — software, automation, and ERP solutions presented as collectible trading cards.',
  openGraph: {
    title: 'Portfolio | Projects & Quests by Duta Alamin',
    description:
      'Browse Duta Alamin\'s project collection — software, automation, and ERP solutions presented as collectible trading cards.',
    url: 'https://duta1.com/portfolio',
  },
}

export default function PortfolioLayout({ children }) {
  return children
}
