'use client'

import Image from 'next/image'
import RandomName from '../components/RandomName'
import SocialLinks from '../components/SocialLinks'
import Typewriter from '../components/Typewriter'
import DelayedFadeIn from '../components/DelayedFadeIn'

const socialLinksForAbout = [
  {
    href: 'https://www.linkedin.com/in/dutaalamin',
    icon: '/logo/linkedin.png',
    alt: 'LinkedIn',
  },
  {
    href: 'https://instagram.com/dutaalamin',
    icon: '/logo/instagram.svg', 
    alt: 'Instagram',
  },
  {
    href: 'https://open.spotify.com/playlist/2gQgfHfdjW8S0S4Ypfu1jV',
    icon: '/logo/spotify.svg', 
    alt: 'Spotify',
  },
]

export const getAboutPages = (isInitialLoad = false) => [
  {
    content: (
      <>
        <div className="text-sm flex flex-row items-center gap-6">
          <Image src="/images/duta.png" width={90} height={90} alt="Avatar" className="rounded-full" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              Duta Alamin
            </h2>
            <p className="text-sm text-gray-400 pt-2 pb-2">Banten, Indonesia</p>
            <SocialLinks links={socialLinksForAbout} />
          </div>
        </div>

        <p className="pt-4 whitespace-pre-wrap leading-relaxed">
          <Typewriter 
            text={`I’m a Software Engineer with experience in ERP and IT systems. Currently a Factory Automation Engineer, bridging software and industrial operations to build reliable solutions.\n\nPassionate about solving problems with tech and delivering efficient projects.`} 
            delay={isInitialLoad ? 2500 : 0} 
            speed={30} 
          />
        </p>
      </>
    ),
    info: (
      <DelayedFadeIn delay={isInitialLoad ? 8000 : 6500}>
        <div className="bg-gray-300/80 border-2 rounded p-2">
          <ul>
            <li>🎯 Interests: Software Engineering, Automation, ERP, AI, System Integration</li>
          </ul>
        </div>
      </DelayedFadeIn>
    ),
  },

  {
    content: (
      <>
        <div className="block mt-1">
          <h2 className="text-xl font-bold lg:text-2xl">UPN Veteran Yogyakarta</h2>
          <p>(2019 - 2023)</p>
          <p className='text-gray-500'>Bachelor of Informatics</p>
        </div>

        <p className="pt-2">Research:</p>
        <p className="font-bold text-blue-800">
          Convolutional Neural Network (CNN) Deep Learning Model to Classify Images of Mount Merapi
        </p>

        <p className="pt-2">
          Analyzed volcanic images captured under diverse environmental conditions to improve early warning detection accuracy. Explored and demonstrated the efficacy of deep learning networks in real-time volcanic activity monitoring systems.
        </p>
      </>
    ),
    info: null,
  },
]
