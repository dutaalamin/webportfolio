// Server component layout — provides per-route metadata only.

export const metadata = {
  title: 'Experience',
  description:
    'Explore Duta Alamin\'s career quests — professional experience in software engineering, ERP implementation, and factory automation.',
  openGraph: {
    title: 'Experience | Career Quests - Duta Alamin',
    description:
      'Explore Duta Alamin\'s career quests — professional experience in software engineering, ERP implementation, and factory automation.',
    url: 'https://duta1.com/experience',
  },
}

export default function ExperienceLayout({ children }) {
  return children
}
