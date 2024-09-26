"use client";

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
    <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
      <div className="label text-black font-semibold">{props.label || '-'}</div>
      <div className="value text-black/70 text-end md:text-center">{props.value || '-'}</div>
    </div>
  );
};

const DetailProdusenPage = () => {
  interface Response {
    status: number;
    message: string;
    data: Data;
  }

  interface Data {
    id: number;
    kepangProdusenEceranId: number;
    kepangMasterKomoditasId: number;
    satuan: string;
    harga: number;
    keterangan: string;
    createdAt: string;
    updatedAt: string;
    kepangProdusenEceran: KepangProdusenEceran;
    komoditas: Komoditas;
  }

  interface KepangProdusenEceran {
    id: number;
    tanggal: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Komoditas {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
  }

  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const { id } = params;

  const { data: detailProdusenDanEceran, error } = useSWR<Response>(
    `/kepang/produsen-eceran/get/${id}`,
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

  if (error) return <div>Error loading data...</div>;
  if (!detailProdusenDanEceran) return <div>Loading...</div>;

  const data = detailProdusenDanEceran.data;

  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Produsen dan Eceran</div>
      {/* back button */}
      <div className="flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/ketahanan-pangan/produsen-dan-eceran" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
        <div className="font-semibold mb-2 md:text-lg text-base">Data Produsen dan Eceran</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
          <LabelDetail label='Komoditas' value={data?.komoditas?.nama} />
          <LabelDetail label='Satuan' value={data?.satuan} />
          <LabelDetail label='Harga' value={data?.harga} />
          <LabelDetail label='Keterangan' value={data?.keterangan} />
        </div>
      </div>
      {/* detail */}
    </div>
  );
};

export default DetailProdusenPage;
