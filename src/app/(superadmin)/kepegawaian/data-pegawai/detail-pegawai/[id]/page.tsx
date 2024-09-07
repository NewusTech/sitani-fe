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
  name?: string;
  number?: number;
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
      <div className="label text-black">{props.label || '-'}</div>
      <div className="name text-black/70">{props.name || props.number || '-'}</div>
    </div>
  )
}

const DetailPegawaiPage = () => {
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
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Pegawai</div>
      {/* title */}
      <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/kepegawaian/data-pegawai" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Pegawai</div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
          <LabelDetail label='Nama' name={data?.nama} />
          <LabelDetail label='NIP' number={data?.nip} />
          <LabelDetail label='Tempat' name={data?.tempatLahir} />
          <LabelDetail label='Tanggal Lahir' name={data?.tglLahir} />
          <LabelDetail label='Pangkat/Gol Ruang' name={`${data?.pangkat} / ${data?.golongan}`} />
          <LabelDetail label='TMT Pangkat' name={data?.tmtPangkat} />
          <LabelDetail label='Jabatan' name={data?.jabatan} />
          <LabelDetail label='TMT Jabatan' name={data?.tmtJabatan} />
          <LabelDetail label='Usia' name={`${data?.usia} Tahun`} />
          <LabelDetail label='Masa Kerja' name={data?.masaKerja} />
          <LabelDetail label='Keterangan' name={data?.keterangan} />
        </div>
        <div className="wr">
          <div className="font-semibold mb-2 text-lg mt-5 uppercase">Diklat Struktural</div>
          <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
            <LabelDetail label='Nama Diklat' name={data?.namaDiklat} />
            <LabelDetail label='Tanggal Diklat' name={data?.tglDiklat} />
            <LabelDetail label='Jam Diklat' name={`${data?.totalJam} Jam`} />
          </div>
        </div>
        <div className="wr">
          <div className="font-semibold text-lg mb-2 mt-5 uppercase">Pendidikan Umum</div>
          <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
            <LabelDetail label='Nama Pendidikan' name={data?.namaPendidikan} />
            <LabelDetail label='Tahun Lulus' number={data?.tahunLulus} />
            <LabelDetail label='Jenjang' name={data?.jenjangPendidikan} />
          </div>
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPegawaiPage