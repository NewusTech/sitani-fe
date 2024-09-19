"use client"
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface LabelProps {
  label?: string;
  value?: string | number | JSX.Element | JSX.Element[]; // Allow arrays here
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
      <div className="label text-black font-semibold">{props.label || '-'}</div>
      <div className="value text-black/70">
        {props.value instanceof Array ? (
          props.value.map((item, index) => <div key={index}>{item}</div>)
        ) : (
          props.value || '-'
        )}
      </div>
    </div>
  );
};

// Interfaces for API response
interface Desa {
  id: number;
  nama: string;
  kecamatanId: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  penyuluh_kecamatan_desabinaan: {
    penyuluh_kecamatan_id: number;
    desa_id: number;
  };
}

interface PenyuluhKecamatan {
  id: number;
  kecamatanId: number;
  nama: string;
  nip: string;
  pangkat: string;
  golongan: string;
  keterangan: string;
  desa: Desa[];
}

interface ApiResponse {
  status: number;
  message: string;
  data: PenyuluhKecamatan;
}

const DetailDataKecamatanPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams();

  const { data: dataPenyuluhKab, error } = useSWR<ApiResponse>(
    `/penyuluh-kecamatan/get/${id}`, // Fixed URL
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

  const data = dataPenyuluhKab?.data;

  return (
    <div>
      {/* Title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">
        Daftar Penempatan Penyuluh Pertanian Kecamatan
      </div>
      {/* Back Link */}
      <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
        <Link
          href="/penyuluhan/data-kecamatan"
          className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'
        >
          Kembali
        </Link>
      </div>
      {/* Detail */}
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Penyuluh</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <LabelDetail label='Kecamatan' value={data?.kecamatanId} />
          <LabelDetail
            label='Wilayah Desa Binaan'
            value={data?.desa.map(d => <div key={d.id}>{d.nama}</div>)}
          />
          <LabelDetail label='Nama' value={data?.nama} />
          <LabelDetail label='NIP' value={data?.nip} />
          <LabelDetail label='Pangkat' value={data?.pangkat} />
          <LabelDetail label='Golongan' value={data?.golongan} />
          <LabelDetail label='Keterangan' value={data?.keterangan} />
        </div>
      </div>
    </div>
  );
}

export default DetailDataKecamatanPage;
