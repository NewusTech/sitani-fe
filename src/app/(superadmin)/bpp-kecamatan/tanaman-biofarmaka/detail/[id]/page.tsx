import React from 'react'
import AlertIcon from '../../../../../../../public/icons/AlertIcon'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LabelProps {
    label?: string;
    name?: string;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex gap-2 justify-between lg:justify-start'>
            <div className="label text-black">{props.label || '-'} : </div>
            <div className="name text-black/70">{props.name || '-'}</div>
        </div>
    )
}

const DetailTanamanBiofarmaka = () => {
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail
                Laporan Tanaman Biofarmaka</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/korlub/tanaman-biofarmaka" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Produsen dan Eceran</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label='Nama Tanaman' name='Melinting, Braja Selebah, Labuhan Maringgai' />
                    <LabelDetail label='Luas Tanaman Akhir Triwulan Yang Lalu (m2)' name='1312312' />
                    <div className="div">
                        <div className="text-primary text-lg font-bold mb-2">Luas Panen (m2)</div>
                        <div className="flex justify-between">
                            <LabelDetail label='Habis Dibongkar' name='Keterangan' />
                        </div>
                        <LabelDetail label='Belum Habis' name='Keterangan' />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-5">
                    <LabelDetail label='Luas Rusak / Tidak Berhasil / Puso (m2)' name='1312312' />
                    <LabelDetail label='Luas Penanaman Baru / Tambah Tanam (m2)' name='1312312' />
                    <LabelDetail label='Luas Tanaman Akhir Truwulan Laporan (m2) (3)-(4)-(6)+(7)' name='1312312' />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-5">
                    <div className="div">
                        <div className="text-primary text-lg font-bold mb-2">Produksi (Kilogram)</div>
                        <div className="flex justify-between">
                            <LabelDetail label='Dipanen Habis/Dibongkar' name='Keterangan' />
                        </div>
                        <LabelDetail label='Belum Habis' name='Keterangan' />
                    </div>
                    <LabelDetail label='Rata-rata Harga Jual di Petani Per Satuan Produksi (Rupiah)' name='1312312' />
                    <LabelDetail label='Keterangan' name='1312312' />
                </div>

            </div>
            {/* detail */}
        </div>
    )
}

export default DetailTanamanBiofarmaka