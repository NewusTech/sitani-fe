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
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Penerima UPPO</div>
      {/* title */}
      <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/psp/data-penerima-uppo" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Penerima UPPO</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
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
