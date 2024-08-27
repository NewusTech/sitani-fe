import CardBerita from '@/components/landing-page/Beranda/BeritaTerkini/Card'
import Artikel from '@/components/landing-page/DetailBerita/Artikel'
import React from 'react'

const dummyArtikel = 
  {
    image: "/assets/images/detail-berita.png",
    date: "November 12, 2023",
    title: "Lorem ipsum dolor sit amet",
    desc: "Lorem ipsum dolor sit amet consectetur. Diam accumsan sollicitudin amet faucibus odio aliquam. Ac mauris mauris faucibus eget. Risus morbi tellus dignissim ullamcorper sed. Amet enim enim fusce ultricies eu aliquam ut nec. Ac blandit consequat hac cursus ac. Pellentesque imperdiet erat eros nibh diam at metus. Lacus eleifend purus tellus fringilla mattis arcu sit et neque. Euismod mollis sed risus vel ultrices leo in ultrices interdum. Non pretium commodo dictumst aliquet tincidunt ultrices tellus donec. Pharetra praesent mattis tincidunt quis risus scelerisque. Cras adipiscing enim amet neque dictum. Tincidunt faucibus fermentum egestas leo. Varius consectetur dignissim porttitor amet commodo vitae praesent. Leo integer faucibus mattis pharetra mattis augue sem ornare. Eu odio nunc tempus lectus morbi. Egestas feugiat volutpat eget consectetur vulputate pellentesque. Adipiscing et viverra enim venenatis vitae arcu eget.",
  }

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

const DetailBeritaPage = () => {
  return (
    <div className="detail md:pt-[160px] pt-[20px] pb-[30px] container mx-auto px-3 md:px-0">
      {/* artikel */}
      <Artikel title={dummyArtikel.title} desc={dummyArtikel.desc} image={dummyArtikel.image} date={dummyArtikel.date}/>
      {/* artikel */}

      {/* header */}
      <div className="header items-center flex flex-col gap-3 md:gap-8 mb-[30px] mt-[50px]">
        <div className="text-primary font-semibold text-2xl md:text-3xl flex-shrink-0">Berita Lainnya</div>
        <div className="garis h-[3px] w-full bg-secondary"></div>
      </div>
      {/* header */}

      {/* card */}
      <div className="berita grid grid-cols-1 md:grid-cols-3 gap-4 mb-[90px] md:mb-5">
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
      {/* card */}
    </div>
  )
}

export default DetailBeritaPage