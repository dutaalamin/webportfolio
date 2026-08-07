'use client'

import { useState, useEffect } from 'react'

const roles = ['DUTA ALAMIN', 'SOFTWARE ENGINEER', 'AUTOMATION ENGINEER', 'ERP CONSULTANT']

export default function RoleRotate() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="text-2xl lg:text-3xl xl:text-5xl font-pressStart transition-all duration-500">
      {roles[index]}
    </p>
  )
}