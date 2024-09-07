import React, { useState } from 'react'
import ShareBeritaIcon from '../../../../../public/icons/ShareBerita'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import CardBerita from './Card'
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'

const dummyBerita = [
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur',

  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-2',


  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-3',

  },
  {
    title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
    date: 'January 13, 2024',
    desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    image: '/assets/images/cardberita.png',
    slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-4',

  }
]

const BeritaTerkini = () => {
  // INTEGRASI
  interface Artikel {
    id?: string; // Ensure id is a string
    judul?: string;
    slug?: string;
    konten?: string;
    image?: string;
    createdAt?: string;
  }

  interface Pagination {
    page: number,
    perPage: number,
    totalPages: number,
    totalCount: number,
  }

  interface ResponseData {
    data: Artikel[];
    pagination: Pagination;
  }

  interface Response {
    status: string,
    data: ResponseData,
    message: string
  }
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();
  // search
  const [search, setSearch] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const { data: dataArtikel }: SWRResponse<Response> = useSWR(
    `article/get?page=1&search=${search}&limit=4`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  // INTEGRASI
  return (
    <div className="berita container mx-auto md:py-[60px] py-[40px]">
      <div className="header items-center flex flex-col md:flex-row gap-5">
        <div className="text-primary font-semibold text-2xl md:text-3xl flex-shrink-0">Berita Terkini</div>
        <div className="garis h-[3px] w-full bg-secondary"></div>
        <div className="search w-full">
          <Input
            placeholder="Cari Berita"
            value={search}
            onChange={handleSearchChange}
            className='w-full md:min-w-[300px] border border-primary'
            rightIcon={<SearchIcon />}
          />
        </div>
      </div>
      {/* card */}
      <div className="berita mt-[25px] md:mt-[50px] grid grid-cols-1 md:grid-cols-4 gap-4">
        {dataArtikel?.data?.data && dataArtikel.data.data.length > 0 ? (
          dataArtikel.data.data.map((berita, index) => (
            <CardBerita
              key={berita.id}
              title={berita.judul}
              desc={berita.konten}
              date={berita.createdAt}
              slug={berita.slug}
              image={berita.image}
            />
          ))
        ) : (
          <div className="flex justify-center items-center w-full col-span-4 py-5">
            Tidak ada data
          </div>
        )}
      </div>
      <div className="flex justify-center mt-5 md:mt-10">
        <Link href="/berita" className="selengkapnya flex items-center gap-5 bg-primary p-3 px-7 rounded-full text-white text-base md:text-lg hover:bg-primary-hover">
          Lihat semua berita
          <ShareBeritaIcon />
        </Link>
      </div>
    </div>
  )
}

export default BeritaTerkini
