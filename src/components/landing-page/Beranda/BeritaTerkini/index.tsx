import React from 'react'
import ShareBeritaIcon from '../../../../../public/icons/ShareBerita'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import CardBerita from './Card'

const dummyBerita = [
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date : 'January 13, 2024',
    desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
    image: '/assets/images/cardberita.png',
    link: '/berita/detail-berita'
  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date : 'January 13, 2024',
    desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
    image: '/assets/images/cardberita.png',
    link: '/berita/detail-berita'

  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date : 'January 13, 2024',
    desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
    image: '/assets/images/cardberita.png',
    link: '/berita/detail-berita'

  }
]

const BeritaTerkini = () => {
  return (
    <div className="berita container mx-auto md:py-[60px] py-[40px]">
      <div className="header items-center flex flex-col md:flex-row gap-5">
        <div className="text-primary font-semibold text-2xl md:text-3xl flex-shrink-0">Berita Terkini</div>
        <div className="garis h-[3px] w-full bg-secondary"></div>
        <div className="search w-full">
          <Input
            placeholder="Cari Berita"
            className='w-full md:min-w-[300px] border border-primary'
            rightIcon={<SearchIcon />}
          />
        </div>
      </div>
      {/* card */}
      <div className="berita mt-[25px] md:mt-[50px] grid grid-cols-1 md:grid-cols-3 gap-4">
        {dummyBerita.map((berita, index) => (
          <CardBerita 
            key={index}
            title={berita.title}
            desc={berita.desc}
            date={berita.date}
            link={berita.link}
            image={berita.image}
          />
        ))}
      </div>
      <div className="flex justify-center mt-5 md:mt-10">
        <Link href="/berita" className="selengkapnya flex items-center gap-5 bg-primary p-3 px-7 rounded-full text-white text-lg md:text-xl">
          Lihat semua berita
          <ShareBeritaIcon />
        </Link>
      </div>
    </div>
  )
}

export default BeritaTerkini
