"use client"

import React from 'react'
import CardGaleri from './Card'
import ShareBeritaIcon from '../../../../../public/icons/ShareBerita'
import Link from 'next/link'
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'

const GaleriLanding = () => {
  // INTEGRASI
  interface Galeri {
    id?: string; // Ensure id is a string
    image?: string;
    deskripsi?: string;
  }

  interface Pagination {
    page: number,
    perPage: number,
    totalPages: number,
    totalCount: number,
  }

  interface ResponseData {
    data: Galeri[];
    pagination: Pagination;
  }

  interface Response {
    status: string,
    data: ResponseData,
    message: string
  }
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  // GETALL
  const { data: dataGaleri }: SWRResponse<Response> = useSWR(
    `galeri/get?page=1&limit=6`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );
  return (
    <div className="berita container mx-auto py-[40px] md:pb-[100px] pb-[130px]">
      <div className="header items-center flex gap-5 md:gap-8">
        <div className="garis h-[3px] w-full bg-secondary"></div>
        <div className="text-primary font-semibold text-3xl flex-shrink-0">Galeri</div>
        <div className="garis h-[3px] w-full bg-secondary"></div>
      </div>
      {/* card */}
      <div className="berita md:mt-[60px] mt-[30px] grid grid-cols-1 md:grid-cols-3 gap-4">
      {dataGaleri?.data?.data && dataGaleri.data.data.length > 0 ? (
          dataGaleri.data.data.map((berita, index) => (
          <CardGaleri key={index} image={berita.image} />
        ))
      ) : (
        <div className="flex justify-center items-center w-full col-span-4 py-5">
          Tidak ada data
        </div>
      )}
      </div>
      <div className="flex justify-center  mt-5 md:mt-10">
        <Link href="/galeri" className="selengkapnya flex items-center gap-5 bg-primary p-3 px-7 rounded-full text-white text-base md:text-lg hover:bg-primary-hover">
          Lihat selengkapnya
          <ShareBeritaIcon />
        </Link>
      </div>
    </div>
  )
}

export default GaleriLanding