'use client'

import CardBerita from '@/components/landing-page/card-berita'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BerandaPage = () => {
  return (
    <div className='w-full  min-h-screen'>
      {/* home */}
      <div className="home">
        <Image src="/assets/images/home.png" alt="logo" width={100} height={100} unoptimized className='w-full h-screen' />
      </div>
      {/* home */}
      {/* berita terkini */}
      <div className="berita container mx-auto py-[60px]">
        <div className="header items-center flex gap-5">
          <div className="text-primary font-semibold text-3xl flex-shrink-0">Berita Terkini</div>
          <div className="garis h-[3px] w-full bg-secondary"></div>
          <div className="searc">
          <Input placeholder="Cari Berita" className='w-[300px] border border-primary'/>
          </div>
        </div>
        {/* card */}
        <div className="berita mt-[60px] grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardBerita />
        <CardBerita />
        <CardBerita />
        <CardBerita />
        </div>
        <Link href="" className="selengkapnya">
        </Link>
      </div>
      {/* berita terkini */}
    </div>
  )
}

export default BerandaPage