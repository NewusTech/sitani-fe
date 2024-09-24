"use client"

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import useSWR from 'swr';


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

const DetailPenerimaUPPO = () => {
  interface Kecamatan {
    id?: number;
    nama?: string;
  }

  interface Desa {
    id?: number;
    nama?: string;
  }

  interface UPPO {
    tahun?: number;
    namaPoktan?: string;
    ketuaPoktan?: string;
    titikKoordinat?: string;
    kecamatan?: Kecamatan;
    desa?: Desa;
  }

  interface Response {
    status: string;
    data: UPPO;
    message: string;
  }

  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const { id } = params;

  const { data: dataUPPO, error } = useSWR<Response>(
    `/psp/penerima-uppo/get/${id}`,
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

  const data = dataUPPO?.data;

  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary ">Detail Data Penerima UPPO</div>
      {/* title */}
      <div className="flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/psp/data-penerima-uppo" className='bg-white w-[100px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-sm md:text-base'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
        <div className="font-semibold mb-2 text-base md:text-lg">Data Penerima UPPO</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <LabelDetail label='Tahun' name={data?.tahun} />
          <LabelDetail label='Kecamatan' name={data?.kecamatan?.nama} />
          <LabelDetail label='Desa' name={data?.desa?.nama} />
          <LabelDetail label='Nama Poktan' name={data?.namaPoktan} />
          <LabelDetail label='Nama Ketua' name={data?.ketuaPoktan} />
          <LabelDetail label='Titik Koordinat' name={data?.titikKoordinat} />
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPenerimaUPPO;
