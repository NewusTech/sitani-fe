import CardBerita from '@/components/landing-page/Beranda/BeritaTerkini/Card'
import Artikel from '@/components/landing-page/DetailBerita/Artikel'
import React from 'react'

const dummyArtikel =
{
  image: "/assets/images/detail-berita.png",
  date: "November 12, 2023",
  title: "Layanan Pertanian Kini Tersedia di Sitani Lampung Timur",
  desc: `<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>
`,
}

const dummyBerita = [
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: `<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>`,
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur',

  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: `<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>`,
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-2',


  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: `<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>`,
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-3',

  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: `<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>`,
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-4',

  }
]

const DetailBeritaPage = () => {
  return (
    <div className="detail md:pt-[160px] pt-[20px] pb-[30px] container mx-auto px-3 md:px-0">
      {/* artikel */}
      <Artikel title={dummyArtikel.title} desc={dummyArtikel.desc} image={dummyArtikel.image} date={dummyArtikel.date} />
      {/* artikel */}

      {/* header */}
      <div className="header items-center flex md:flex-row flex-col gap-3 md:gap-8 mb-[30px] mt-[50px]">
        <div className="text-primary font-semibold text-2xl md:text-3xl flex-shrink-0">Berita Lainnya</div>
        <div className="garis h-[3px] w-full bg-secondary"></div>
      </div>
      {/* header */}

      {/* card */}
      <div className="berita grid grid-cols-1 md:grid-cols-4 gap-4 mb-[90px] md:mb-5">
        {dummyBerita.map((berita, index) => (
          <CardBerita
            key={index}
            title={berita.title}
            desc={berita.desc}
            date={berita.date}
            slug={berita.slug}
            image={berita.image}
          />
        ))}
      </div>
      {/* card */}
    </div>
  )
}

export default DetailBeritaPage