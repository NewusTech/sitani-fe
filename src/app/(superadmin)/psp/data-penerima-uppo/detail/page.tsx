import React from 'react'
import AlertIcon from '../../../../../../public/icons/AlertIcon'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

const DetailPenerimaPage = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
          <LabelDetail label='Kecamatan' name='Metro Kibang' />
          <LabelDetail label='Desa' name='Jabung' />
          <LabelDetail label='Nama Poktan' name='Kader' />
          <LabelDetail label='Nama Ketua' name='Arif' />
          <LabelDetail label='Titik Kordinat' name='432423423' />
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPenerimaPage