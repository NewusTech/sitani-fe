"use client"

import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import AlertIcon from '../../../../../../../public/icons/AlertIcon';

interface LabelProps {
  label?: string;
  value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
      <div className="label text-black font-semibold">{props.label || '-'}</div>
      <div className="value text-black/70">{props.value || '-'}</div>
    </div>
  );
};

const DetailPegawaiPage = () => {
  const formatDate = (date?: Date): string => {
    if (!date) return ''; // Return an empty string if the date is undefined
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const day = date.getDate();

    return `${year}/${month}/${day}`;
  };

  interface Response {
    status: string;
    messege: string;
    data: Data;
  }

  interface Data {
    id?: number;
    nama?: string;
    nip?: number;
    tempatLahir?: string;
    tglLahir?: string;
    pangkat?: string;
    golongan?: string;
    tmtPangkat?: string;
    jabatan?: string;
    tmtJabatan?: string;
    namaDiklat?: string;
    tglDiklat?: string;
    totalJam?: number;
    namaPendidikan?: string;
    tahunLulus?: number;
    jenjangPendidikan?: string;
    usia?: string;
    masaKerja?: string;
    keterangan?: string;
    createdAt?: string;
    updatedAt?: string;
    bidang?: Bidang;
  }

  interface Bidang {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
  }

  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const { id } = params;

  const { data: dataKepegawaian, error } = useSWR<Response>(
    `/kepegawaian/get/${id}`,
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

  const data = dataKepegawaian?.data;

  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Pegawai</div>
      {/* title */}
      <div className="flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/kepegawaian/data-pegawai" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          Kembali
        </Link>
      </div>
      {/* alert */}
      <div className="p-3 border border-red-400 rounded-md bg-red-100">
        <div className="text-red-600 flex gap-2 items-center">
          <AlertIcon />
          Data pegawai sudah mendekati masa pensiun
        </div>
      </div>
      {/* alert */}
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Pegawai</div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
          <LabelDetail label='Bidang' value={data?.bidang?.nama} />
          <LabelDetail label='Nama' value={data?.nama} />
          <LabelDetail label='NIP' value={data?.nip} />
          <LabelDetail label='Tempat' value={data?.tempatLahir} />
          <LabelDetail label='Tanggal Lahir' value={data?.tglLahir} />
          <LabelDetail label='Pangkat/Gol Ruang' value={`${data?.pangkat} / ${data?.golongan}`} />
          <LabelDetail label='TMT Pangkat' value=
            {data?.tmtPangkat && !isNaN(new Date(data?.tmtPangkat).getTime())
              ? formatDate(new Date(data?.tmtPangkat))
              : ' - '}
          />
          <LabelDetail label='Jabatan' value={data?.jabatan} />
          <LabelDetail label='TMT Jabatan' value={data?.tmtJabatan && !isNaN(new Date(data?.tmtJabatan).getTime())
            ? formatDate(new Date(data?.tmtJabatan))
            : ' - '} />
          <LabelDetail label='Usia' value={`${data?.usia} Tahun`} />
          <LabelDetail label='Masa Kerja' value={data?.masaKerja} />
          <LabelDetail label='Keterangan' value={data?.keterangan} />
        </div>
        <div className="wr">
          <div className="font-semibold mb-2 text-lg mt-5 uppercase">Diklat Struktural</div>
          <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
            <LabelDetail label='Nama Diklat' value={data?.namaDiklat} />
            <LabelDetail label='Tanggal Diklat' value={data?.tglDiklat && !isNaN(new Date(data?.tglDiklat).getTime())
              ? formatDate(new Date(data?.tglDiklat))
              : ' - '} />
            <LabelDetail label='Jam Diklat' value={`${data?.totalJam} Jam`} />
          </div>
        </div>
        <div className="wr">
          <div className="font-semibold text-lg mb-2 mt-5 uppercase">Pendidikan Umum</div>
          <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
            <LabelDetail label='Nama Pendidikan' value={data?.namaPendidikan} />
            <LabelDetail label='Tahun Lulus' value={data?.tahunLulus} />
            <LabelDetail label='Jenjang' value={data?.jenjangPendidikan} />
          </div>
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPegawaiPage