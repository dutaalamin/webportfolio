'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { aboutPages } from './data/aboutData'
import { experienceData } from './data/experienceData'
import { portoData } from './data/portoData'
import { certificateData } from './data/certificateData'
import Cloud from './components/Cloud'
import BackgroundAudio from './components/Audio'
import SocialLinks from './components/SocialLinks'
import { trackEvent } from './lib/trackEvent'
import {
  DocumentIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/24/solid'

const socialLinks = [
  { href: '/CV.pdf', icon: '/logo/cv.svg', alt: 'CV' },
  { href: 'https://wa.me/6285795281890', icon: '/logo/wa.png', alt: 'WhatsApp' },
  {
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=cacasalsabilaadrian@gmail.com',
    icon: '/logo/gmail.png',
    alt: 'Gmail',
  },
  {
    href: 'https://www.linkedin.com/in/salsabila-adrian-a66741226/',
    icon: '/logo/linkedin.png',
    alt: 'LinkedIn',
  },
  {
    href: 'https://medium.com/@salsabilaadrian',
    icon: '/logo/medium.png',
    alt: 'Medium',
  },
  {
    href: 'https://github.com/salsabilaadrian',
    icon: '/logo/github.png',
    alt: 'Github',
  },
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentCertificate, setCurrentCertificate] = useState(0)
  const [openSections, setOpenSections] = useState({})
  const [openItems, setOpenItems] = useState({})
  const [aboutPage, setAboutPage] = useState(0)

  useEffect(() => {
    trackEvent('pageview', '/')
    const timeout = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  // Track section views when they come into viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            if (sectionId) {
              trackEvent('section-view', `/#${sectionId}`)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    const sections = document.querySelectorAll('[id^="section-"]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const nextCertificate = () => {
    setCurrentCertificate((prev) => (prev + 1) % certificateData.length)
  }

  const prevCertificate = () => {
    setCurrentCertificate((prev) => (prev - 1 + certificateData.length) % certificateData.length)
  }

  function getIconForLabel(label) {
    const lower = label.toLowerCase()
    if (lower.includes('certificate')) return <DocumentIcon className="w-4 h-4 inline-block mr-1" />
    if (lower.includes('project') || lower.includes('demo') || lower.includes('preview')) return <GlobeAltIcon className="w-4 h-4 inline-block mr-1" />
    if (lower.includes('github')) return <CodeBracketIcon className="w-4 h-4 inline-block mr-1" />
    return <LinkIcon className="w-4 h-4 inline-block mr-1" />
  }

  const fadeClass = (delay = 0) =>
    `${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 ease-out delay-[${delay}ms]`

  return (
    <main className="relative w-full min-h-screen bg-white text-black font-pressStart">
      <BackgroundAudio
        src="/audio/home.mp3"
        volume={1.0}
        delay={0}
        className="fixed right-4 top-4 z-50"
      />

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-40 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Salsabila Adrian</h1>
          <div className="flex gap-4 text-sm">
            <a href="#section-home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#section-about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#section-experience" className="hover:text-blue-600 transition-colors">Experience</a>
            <a href="#section-portfolio" className="hover:text-blue-600 transition-colors">Portfolio</a>
            <a href="#section-certificates" className="hover:text-blue-600 transition-colors">Certificates</a>
          </div>
        </div>
      </nav>

      {/* Cloud Layers */}
      <Cloud top={30} direction="left" speed={120} opacity={0.5} delay={2100} />
      <Cloud top={80} direction="right" speed={50} opacity={0.3} delay={2100} />

      {/* Home Section */}
      <section id="section-home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Character */}
        <div className={`hidden z-5 lg:block absolute bottom-[160px] left-3/4 translate-x-1/2 ${fadeClass(600)}`}>
          <Image
            src="/images/char.png"
            alt="Character"
            width={100}
            height={100}
            className="animate-charMove"
            priority
          />
        </div>

        {/* Content */}
        <div className={`relative z-5 max-w-7xl mx-auto pt-28 px-6 grid gap-8 grid-cols-1 lg:grid-cols-3 ${fadeClass(900)}`}>
          <div className="flex flex-col gap-2">
            <p className="text-2xl lg:text-3xl xl:text-5xl transition-all duration-500">
              SYSTEM ANALYST
            </p>
            <SocialLinks links={socialLinks} />
          </div>
          <div className="lg:pl-20 lg:col-span-2">
            <p className="text-xl sm:text-2xl xl:text-4xl mb-2">Welcome, HR Team!</p>
            <p className="text-sm sm:text-lg xl:text-2xl pb-5">Ready to explore my professional journey?</p>
            <p className="text-sm sm:text-lg xl:text-2xl mb-4">Scroll down to discover my experience and skills!</p>
          </div>
        </div>

        {/* Ground */}
        <div className={`absolute bottom-0 w-full ${fadeClass(200)}`}>
          <Image
            src="/images/ground.png"
            alt="Ground"
            width={1600}
            height={200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* About Section */}
      <section id="section-about" className="relative min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAboutPage((prev) => Math.max(0, prev - 1))}
                disabled={aboutPage === 0}
                className="text-lg cursor-pointer border border-gray-500 rounded-md px-3 py-1 hover:bg-gray-200 disabled:opacity-30"
              >
                {'<'}
              </button>
              <button
                onClick={() => setAboutPage((prev) => Math.min(aboutPages.length - 1, prev + 1))}
                disabled={aboutPage === aboutPages.length - 1}
                className="text-lg cursor-pointer border border-gray-500 rounded-md px-3 py-1 hover:bg-gray-200 disabled:opacity-30"
              >
                {'>'}
              </button>
            </div>

            <div className="text-sm">
              <div className={`flex flex-col sm:flex-row ${aboutPages[aboutPage].photoPosition === 'right' ? 'sm:flex-row-reverse' : ''} items-start gap-6`}>
                {aboutPages[aboutPage].photoSrc && (
                  <Image
                    src={aboutPages[aboutPage].photoSrc}
                    alt="Section Image"
                    width={aboutPages[aboutPage].photoSize?.width || 120}
                    height={aboutPages[aboutPage].photoSize?.height || 120}
                    className="rounded-lg mx-auto sm:mx-0"
                  />
                )}
                <div className="flex-1 text-sm">{aboutPages[aboutPage].content}</div>
              </div>

              {aboutPages[aboutPage].info && (
                <div className="mt-4 text-sm">{aboutPages[aboutPage].info}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="section-experience" className="relative min-h-screen bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
          
          <div className="flex justify-center mb-8">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100 bg-white text-gray-700 hover:text-black font-medium"
              onClick={() => trackEvent('download-cv', '/cv.pdf')}
            >
              <span>↓</span> Download CV
            </a>
          </div>

          {experienceData.map((yearData, yearIndex) => (
            <div key={yearIndex} className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gray-100 py-4 rounded-lg">
                {yearData.year}
              </h3>
              
              {Object.entries(yearData.sections).map(([sectionTitle, items], idx) => (
                <div key={idx} className="mb-8 border border-gray-300 rounded-md bg-white overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-3 bg-gray-200 font-semibold flex justify-between items-center"
                    onClick={() => toggleSection(`${yearIndex}-${sectionTitle}`)}
                  >
                    <span>{sectionTitle}</span>
                    <span>{openSections[`${yearIndex}-${sectionTitle}`] ? '▾' : '▸'}</span>
                  </button>

                  {openSections[`${yearIndex}-${sectionTitle}`] && (
                    <ul className="divide-y divide-gray-200">
                      {items.map((item, index) => {
                        const key = `${yearIndex}-${sectionTitle}-${index}`
                        const isOpen = openItems[key]

                        return (
                          <li key={key} className="px-4 py-3">
                            <button
                              onClick={() => toggleItem(key)}
                              className="w-full text-left font-medium flex justify-between items-center"
                            >
                              <div className="flex gap-4">
                                <span>
                                  <h4 className='font-bold pb-1'>{item.title}</h4>
                                  <p className="text-gray-800">{item.position}</p>
                                  <p className="text-gray-800/60">({item.date})</p>
                                  <p className="italic text-gray-600">{item.location}</p>
                                </span>
                              </div>
                              <span>{isOpen ? '▾' : '▸'}</span>
                            </button>

                            {isOpen && (
                              <div className="mt-2 text-sm space-y-2 pt-4">
                                <ul className="list-disc list-inside space-y-6 text-xs">
                                  {item.description.map((desc, i) => (
                                    <li key={i} className="text-gray-800">
                                      <span className="font-bold text-gray-600">{desc.subtitle}</span>
                                      <p className="pt-2 text-gray-500">{desc.subdesc}</p>
                                    </li>
                                  ))}
                                  {item.links?.length > 0 && (
                                    <div className="pt-2 text-gray-600">
                                      <strong>Links:</strong>
                                      <ul className="list-disc ml-5 mt-1 space-y-1">
                                        {item.links.map((linkObj, linkIndex) => (
                                          <li key={linkIndex}>
                                            <a
                                              href={linkObj.url}
                                              className="text-blue-500 underline hover:text-blue-700 transition-colors"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={() => trackEvent(`link-click-${linkObj.label.toLowerCase().replace(/\s/g, '-')}`, linkObj.url)}
                                            >
                                              {getIconForLabel(linkObj.label)}
                                              {linkObj.label}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </ul>

                                {item.skills && (
                                  <p className='text-xs border border-gray-400 rounded-xl p-3'>
                                    <strong>🎮 Skills:</strong>
                                    <p className='text-gray-500 pt-1'>{item.skills.join(', ')}</p>
                                  </p>
                                )}

                                {item.tools && (
                                  <p className='text-xs border border-gray-400 rounded-xl p-3'>
                                    <strong>⚒ Tools:</strong> 
                                    <p className='text-gray-500 pt-1'>{item.tools.join(', ')}</p>
                                  </p>
                                )}
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="section-portfolio" className="relative min-h-screen bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Portfolio</h2>
          
          {portoData.map((categoryData, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center bg-white py-4 rounded-lg">
                {categoryData.year}
              </h3>
              
              {Object.entries(categoryData.sections).map(([sectionTitle, items], idx) => (
                <div key={idx} className="mb-8 border border-gray-300 rounded-md bg-white overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-3 bg-gray-200 font-semibold flex justify-between items-center"
                    onClick={() => toggleSection(`portfolio-${categoryIndex}-${sectionTitle}`)}
                  >
                    <span>{sectionTitle}</span>
                    <span>{openSections[`portfolio-${categoryIndex}-${sectionTitle}`] ? '▾' : '▸'}</span>
                  </button>

                  {openSections[`portfolio-${categoryIndex}-${sectionTitle}`] && (
                    <ul className="divide-y divide-gray-200">
                      {items.map((item, index) => {
                        const key = `portfolio-${categoryIndex}-${sectionTitle}-${index}`
                        const isOpen = openItems[key]

                        return (
                          <li key={key} className="px-4 py-3">
                            <button
                              onClick={() => toggleItem(key)}
                              className="w-full text-left font-medium flex justify-between items-center"
                            >
                              <div className="flex gap-4">
                                <span>
                                  <h4 className='font-bold pb-1'>{item.title}</h4>
                                  <p className="text-gray-800">{item.position}</p>
                                  <p className="text-gray-800/60">({item.date})</p>
                                </span>
                              </div>
                              <span>{isOpen ? '▾' : '▸'}</span>
                            </button>

                            {isOpen && (
                              <div className="mt-2 text-sm space-y-2 pt-4">
                                <ul className="list-disc list-inside space-y-6 text-xs">
                                  {item.description.map((desc, i) => (
                                    <li key={i} className="text-gray-800">
                                      <span className="font-bold text-gray-600">{desc.subtitle}</span>
                                      {desc.subdesc && <p className="pt-2 text-gray-500">{desc.subdesc}</p>}
                                      }
                                    </li>
                                  ))}
                                  {item.links?.length > 0 && (
                                    <div className="pt-2 text-gray-600">
                                      <strong>Links:</strong>
                                      <ul className="list-disc ml-5 mt-1 space-y-1">
                                        {item.links.map((linkObj, linkIndex) => (
                                          <li key={linkIndex}>
                                            <a
                                              href={linkObj.url}
                                              className="text-blue-500 underline hover:text-blue-700 transition-colors"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={() => trackEvent(`portfolio-link-${linkObj.label.toLowerCase().replace(/\s/g, '-')}`, linkObj.url)}
                                            >
                                              {getIconForLabel(linkObj.label)}
                                              {linkObj.label}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </ul>

                                {item.skills && (
                                  <p className='text-xs border border-gray-400 rounded-xl p-3'>
                                    <strong>🎮 Skills:</strong>
                                    <p className='text-gray-500 pt-1'>{item.skills.join(', ')}</p>
                                  </p>
                                )}

                                {item.tools && (
                                  <p className='text-xs border border-gray-400 rounded-xl p-3'>
                                    <strong>⚒ Tools:</strong> 
                                    <p className='text-gray-500 pt-1'>{item.tools.join(', ')}</p>
                                  </p>
                                )}
                              </div>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Certificates Section */}
      <section id="section-certificates" className="relative min-h-screen bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Certificates</h2>
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image
              src={certificateData[currentCertificate].image}
              alt={certificateData[currentCertificate].alt}
              width={600}
              height={400}
              className="rounded shadow-xl shadow-black/20 object-contain max-w-full h-auto"
            />

            <div className="flex gap-4">
              <button
                onClick={prevCertificate}
                className="text-lg shadow-lg border border-gray-500 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {'<'}
              </button>
              <span className="px-4 py-2 text-sm">
                {currentCertificate + 1} / {certificateData.length}
              </span>
              <button
                onClick={nextCertificate}
                className="text-lg shadow-lg border border-gray-500 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Let's Connect!</h3>
          <p className="text-gray-300 mb-6">Ready to discuss opportunities? I'd love to hear from you.</p>
          <SocialLinks links={socialLinks} />
          <p className="text-gray-400 text-sm mt-8">© 2025 Salsabila Adrian. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}