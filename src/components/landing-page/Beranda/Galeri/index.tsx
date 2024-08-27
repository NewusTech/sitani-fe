import React from 'react'
import CardGaleri from './Card'
import ShareBeritaIcon from '../../../../../public/icons/ShareBerita'
import Link from 'next/link'

const dummyGaleri = [
    {
      image: '/assets/images/galeri1.png'
    },
    {
      image: '/assets/images/galeri1.png'
    },
    {
      image: '/assets/images/galeri1.png'
    },
    {
      image: '/assets/images/galeri1.png'
    },
    {
      image: '/assets/images/galeri1.png'
    },
    {
      image: '/assets/images/galeri1.png'
    },
  ]

const GaleriLanding = () => {
  return (
    <div className="berita container mx-auto py-[40px] pb-[100px]">
        <div className="header items-center flex gap-8">
          <div className="garis h-[3px] w-full bg-secondary"></div>
          <div className="text-primary font-semibold text-3xl flex-shrink-0">Galeri</div>
          <div className="garis h-[3px] w-full bg-secondary"></div>
        </div>
        {/* card */}
        <div className="berita mt-[60px] grid grid-cols-1 md:grid-cols-3 gap-4">
            {dummyGaleri.map((berita, index) => (
              <CardGaleri key={index} image={berita.image} />
            ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link href="/galeri" className="selengkapnya flex items-center gap-5 bg-primary p-3 px-7 rounded-full text-white text-xl">
            Lihat selengkapnya
            <ShareBeritaIcon />
          </Link>
        </div>
      </div>
  )
}

export default GaleriLanding