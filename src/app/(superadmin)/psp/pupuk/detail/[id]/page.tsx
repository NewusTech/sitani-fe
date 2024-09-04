"use client"

import React from 'react'
import Link from 'next/link';
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import { SWRResponse, mutate } from "swr";

interface LabelProps {
  label?: string;
  name?: string;
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
      <div className="label text-black">{props.label || '-'}</div>
      <div className="name text-black/70">{props.name || '-'}</div>
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
    jenisPupuk?: string;
    kandunganPupuk?: string;
    keterangan?: string;
    hargaPupuk?: number; // Change to number
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
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Pupuk</div>
      {/* title */}
      <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/psp/pupuk" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Pupuk</div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
          <LabelDetail label='Jenis Pupuk' name={dataPupuk?.data.jenisPupuk} />
          <LabelDetail label='Kandungan Pupuk' name={dataPupuk?.data?.kandunganPupuk} />
          <LabelDetail label='Keterangan' name={dataPupuk?.data.keterangan} />
          <LabelDetail label='Harga Pupuk' name={
            dataPupuk?.data?.hargaPupuk ?
              new Date(dataPupuk.data?.hargaPupuk).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : '-'
          } />
          <LabelDetail label='Keterangan' name={dataPupuk?.data.keterangan} />
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPupukPage