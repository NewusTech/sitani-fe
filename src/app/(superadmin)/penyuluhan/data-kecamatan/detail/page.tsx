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

const DetailDataKecamatanPage = () => {
  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Daftar Penempatan Penyuluh Pertanian Pertanian</div>
      {/* title */}
      <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
        <Link href="/penyuluhan/data-kecamatan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          Kembali
        </Link>
      </div>
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Pupuk</div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
          <LabelDetail label='Kecamatan' name='Sukadana' />
          <LabelDetail label='Wilayah Desa Binaan' name='Melinting, Braja Selebah, Labuhan Maringgai' />
          <LabelDetail label='Nama' name='Hardono' />
          <LabelDetail label='NIP' name='32423423432' />
          <LabelDetail label='Pangkat' name='Pembina Utama' />
          <LabelDetail label='Golongan' name='IV/a' />
          <LabelDetail label='Keterangan' name='Keterangan' />
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailDataKecamatanPage