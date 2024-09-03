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

const DetailHargaPanganPage = () => {
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Harga Pangan Eceran</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/ketahanan-pangan/harga-pangan-eceran" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Harga Pangan Eceran</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Komoditas</div>
                        <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Nama' name='Beras Premium Eceran' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Bulan</div>
                        <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Januari' name='123000' />
                            <LabelDetail label='Februari' name='123000' />
                            <LabelDetail label='Maret' name='123000' />
                            <LabelDetail label='April' name='123000' />
                            <LabelDetail label='Mei' name='123000' />
                            <LabelDetail label='Juni' name='123000' />
                            <LabelDetail label='Juli' name='123000' />
                            <LabelDetail label='Agustus' name='123000' />
                            <LabelDetail label='September' name='123000' />
                            <LabelDetail label='Oktober' name='123000' />
                            <LabelDetail label='November' name='123000' />
                            <LabelDetail label='Desember' name='123000' />
                        </div>
                        <hr className='my-2' />
                    </div>
                </div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Komoditas</div>
                        <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Nama' name='Beras Premium Eceran' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Bulan</div>
                        <div className="grid grid-cols-2 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Januari' name='123000' />
                            <LabelDetail label='Februari' name='123000' />
                            <LabelDetail label='Maret' name='123000' />
                            <LabelDetail label='April' name='123000' />
                            <LabelDetail label='Mei' name='123000' />
                            <LabelDetail label='Juni' name='123000' />
                            <LabelDetail label='Juli' name='123000' />
                            <LabelDetail label='Agustus' name='123000' />
                            <LabelDetail label='September' name='123000' />
                            <LabelDetail label='Oktober' name='123000' />
                            <LabelDetail label='November' name='123000' />
                            <LabelDetail label='Desember' name='123000' />
                        </div>
                        <hr className='my-2' />
                    </div>
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailHargaPanganPage