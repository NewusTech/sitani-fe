'use client'

import Image from 'next/image'
import React from 'react'
import BeritaTerkini from '@/components/landing-page/Beranda/BeritaTerkini'
import GaleriLanding from '@/components/landing-page/Beranda/Galeri'
import { CarouselHome } from '@/components/landing-page/Beranda/CarouselHome'

const BerandaPage = () => {
  return (
    <div className='w-full  min-h-screen'>
      {/* home */}
      <div className="home w-full h-[250px] lg:h-screen">
        {/* <Image src="/assets/images/home.png" alt="logo" width={100} height={100} unoptimized className='w-full h-[250px] lg:h-screen object-cover' /> */}
        <CarouselHome />
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