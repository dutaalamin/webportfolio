// Server component layout — provides per-route metadata only.

export const metadata = {
  title: 'Message',
  description:
    'Contact Duta Alamin — send a message about software engineering, ERP consulting, or automation projects.',
  openGraph: {
    title: 'Contact Duta Alamin | Send a Message',
    description:
      'Contact Duta Alamin — send a message about software engineering, ERP consulting, or automation projects.',
    url: 'https://duta1.com/message',
  },
}

export default function MessageLayout({ children }) {
  return children
}
