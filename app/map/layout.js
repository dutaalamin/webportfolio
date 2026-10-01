// Server component layout — provides per-route metadata only.

export const metadata = {
  title: 'World Map',
  description:
    'Navigate Duta Alamin\'s portfolio world map — jump to any stage: Home, About, Experience, Portfolio, or Message.',
  openGraph: {
    title: 'World Map | Duta Alamin Portfolio',
    description:
      'Navigate Duta Alamin\'s portfolio world map — jump to any stage: Home, About, Experience, Portfolio, or Message.',
    url: 'https://duta1.com/map',
  },
}

export default function MapLayout({ children }) {
  return children
}
