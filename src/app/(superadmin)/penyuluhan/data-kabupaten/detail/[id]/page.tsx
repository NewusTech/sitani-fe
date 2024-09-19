"use client"

import React from 'react';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface LabelProps {
  label?: string;
  value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
      <div className="label text-black font-semibold">{props.label || '-'}</div>
      <div className="value text-black/70">{props.value || '-'}</div>
    </div>
  );
};

const DetailDataKabupatenPage = () => {
  // INTEGRASI
  interface PenyuluhKabupatenResponse {
    status: number;
    message: string;
    data: PenyuluhKabupaten;
  }

  interface PenyuluhKabupaten {
    id: number;
    nama: string;
    nip: string;
    pangkat: string;
    golongan: string;
    keterangan: string;
    kecamatan: Kecamatan[];
  }

  interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
    penyuluh_kabupaten_desabinaan: PenyuluhKabupatenDesaBinaan;
  }

  interface PenyuluhKabupatenDesaBinaan {
    penyuluh_kabupaten_id: number;
    kecamatan_id: number;
  }

  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();

  const { data: dataPenyuluhKab, error } = useSWR<PenyuluhKabupatenResponse>(
    `/penyuluh-kabupaten/get/${id}`,
    async (url: string) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch data:', error);
        return null;
      }
    }
  );

  const data = dataPenyuluhKab?.data;

  if (!data) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Daftar Penempatan Penyuluh Pertanian Kabupaten</div>
      {/* title */}
      <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/penyuluhan/data-kabupaten" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Penyuluh</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <LabelDetail label='Nama' value={data?.nama || '-'} />
          <LabelDetail label='NIP' value={data?.nip || '-'} />
          <LabelDetail label='Pangkat' value={data?.pangkat || '-'} />
          <LabelDetail label='Golongan' value={data?.golongan || '-'} />
          <LabelDetail label='Keterangan' value={data?.keterangan || '-'} />
          <LabelDetail
            label='Wilayah Desa Binaan'
            value={data?.kecamatan?.map(kec => kec.nama).join(', ') || '-'}
          />
        </div>
      </div>
      {/* detail */}
    </div>
  );
};

export default DetailDataKabupatenPage;
