"use client"

import React from 'react'
import Link from 'next/link';
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import { SWRResponse, mutate } from "swr";

interface LabelProps {
  label?: string;
  name?: string | number;
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
      <div className="label text-black">{props.label || '-'}</div>
      <div className="name text-black/70 text-end md:text-start">{props.name || '-'}</div>
    </div>
  )
}

const DetailPupukPage = () => {
  interface Response {
    status: string;
    data: Pupuk;
    message: string;
  }

  interface Pupuk {
    id?: number; // Ensure id is a number
    tahun: number;
    jenisPupuk?: string;
    kandunganPupuk?: string;
    keterangan?: string;
    hargaPupuk?: string; // Change to number
  }

  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: dataPupuk, error } = useSWR<Response>(
    `psp/pupuk/get/${id}`,
    async (url: string) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }
    }
  );

  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl mb-3  font-semibold text-primary">Detail Data Pupuk</div>
      {/* title */}
      <div className="flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/psp/pupuk" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
        <div className="font-semibold mb-2 text-base md:text-lg">Data Pupuk</div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
          <LabelDetail label='Tahun' name={dataPupuk?.data.tahun} />
          <LabelDetail label='Jenis Pupuk' name={dataPupuk?.data.jenisPupuk} />
          <LabelDetail label='Kandungan Pupuk' name={dataPupuk?.data?.kandunganPupuk} />
          <LabelDetail label='Harga Pupuk' name={dataPupuk?.data.hargaPupuk} />
          <LabelDetail label='Keterangan' name={dataPupuk?.data.keterangan} />
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPupukPage