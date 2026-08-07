// Server component layout — provides per-route metadata only.
// The page itself is a client component, so metadata must live here.

export const metadata = {
  title: 'About',
  description:
    'Meet Duta Alamin — Software Engineer & ERP Consultant from Banten, Indonesia. Learn about my journey bridging software and industrial automation.',
  openGraph: {
    title: 'About Duta Alamin | Software Engineer Journey',
    description:
      'Meet Duta Alamin — Software Engineer & ERP Consultant from Banten, Indonesia. Learn about my journey bridging software and industrial automation.',
    url: 'https://duta1.com/about',
  },
}

export default function AboutLayout({ children }) {
  return children
}
