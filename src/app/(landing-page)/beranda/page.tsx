'use client'

import Image from 'next/image'
import React from 'react'
import BeritaTerkini from '@/components/landing-page/Beranda/BeritaTerkini'
import GaleriLanding from '@/components/landing-page/Beranda/Galeri'

const BerandaPage = () => {
  return (
    <div className='w-full  min-h-screen'>
      {/* home */}
      <div className="home">
        <Image src="/assets/images/home.png" alt="logo" width={100} height={100} unoptimized className='w-full h-screen' />
      </div>
      {/* home */}

      {/* berita terkini */}
      <BeritaTerkini />
      {/* berita terkini */}

      {/* galeri */}
      <GaleriLanding />
      {/* galeri */}
    </div>
  )
}

export default BerandaPage