'use client'

import CardBerita from '@/components/landing-page/card-berita'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ShareBerita from '../../../../public/icons/ShareBerita'
import CardGaleri from '@/components/landing-page/card-galeri'
import SearchIcon from '../../../../public/icons/SearchIcon'
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