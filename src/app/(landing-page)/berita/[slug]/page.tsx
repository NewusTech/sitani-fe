"use client";
import BeritaTerkini from '@/components/landing-page/Beranda/BeritaTerkini'
import CardBerita from '@/components/landing-page/Beranda/BeritaTerkini/Card'
import Artikel from '@/components/landing-page/DetailBerita/Artikel'
import React from 'react'
// 
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import { useParams } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage'

const DetailBeritaPage = () => {
  // INTERGRASI
  // GET ONE
  interface Artikel {
    id?: string; // Ensure id is a string
    judul?: string;
    slug?: string;
    konten?: string;
    image?: string;
    createdAt?: string;
  }

  interface Response {
    status: string,
    data: Artikel,
    message: string
  }
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { slug } = params;
  // Get user data
  const { data: dataArtikel, error } = useSWR<Response>(
    `article/get/${slug}`,
    async (url) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }
    },
    {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false
    }
  );
  // GET ONE
  // INTERGRASI

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

  interface ResponseAll {
    status: string,
    data: ResponseData,
    message: string
  }

  const [accessToken] = useLocalStorage("accessToken", "");

  const { data: dataArtikelAll }: SWRResponse<ResponseAll> = useSWR(
    `article/get?page=1`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  console.log(dataArtikelAll)
  // INTEGRASI

  return (
    
    <div className="detail md:pt-[160px] pt-[20px] pb-[30px] container mx-auto ">
      {/* artikel */}
      <Artikel title={dataArtikel?.data.judul} desc={dataArtikel?.data.konten} image={dataArtikel?.data.image} date={dataArtikel?.data?.createdAt} />
      {/* artikel */}

      {/* header */}
      <div className="header items-center flex md:flex-row flex-col gap-3 md:gap-8 mb-[30px] mt-[50px]">
        <div className="text-primary font-semibold text-2xl md:text-3xl flex-shrink-0">Berita Lainnya</div>
        <div className="garis h-[3px] w-full bg-secondary"></div>
      </div>
      {/* header */}

      {/* card */}
      <div className="berita grid grid-cols-1 md:grid-cols-4 gap-4 mb-[90px] md:mb-5">
        {dataArtikelAll?.data?.data.slice(0, 4).map((berita, index) => (
          <CardBerita
            key={berita.id}
            title={berita.judul}
            desc={berita.konten}
            date={berita.createdAt}
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