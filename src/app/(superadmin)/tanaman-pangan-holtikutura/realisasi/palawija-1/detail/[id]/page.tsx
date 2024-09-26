"use client"
import React from 'react'
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface Response {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    id: number;
    tphRealisasiPalawija1Id: number;
    kecamatanId: number;
    jagungPanen: number;
    jagungProduktivitas: number;
    jagungProduksi: number;
    kedelaiPanen: number;
    kedelaiProduktivitas: number;
    kedelaiProduksi: number;
    kacangTanahPanen: number;
    kacangTanahProduktivitas: number;
    kacangTanahProduksi: number;
    createdAt: string;
    updatedAt: string;
    tphRealisasiPalawija1: TphRealisasiPalawija1;
    kecamatan: Kecamatan;
}

interface TphRealisasiPalawija1 {
    id: number;
    bulan: string
    createdAt: string;
    updatedAt: string;
}

interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70 text-end md:text-start">{props.value || '-'}</div>
        </div>
    );
};

const DetailPalawija1Page = () => {
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailPalawija1, error } = useSWR<Response>(
        `/tph/realisasi-palawija-1/get/${id}`,
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
    if (!detailPalawija1) return <div>Loading...</div>;

    const data = detailPalawija1.data;
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Palawija 1</div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Palawija 1</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Kecamatan' value={detailPalawija1?.data?.kecamatan.nama} />
                        </div>
                    </div>
                    <hr className='my-2' />
                    <div className="wr">
                        <div className="font-semibold mb-2 text-sm md:text-lg">Jagung</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija1?.data?.jagungPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija1?.data?.jagungProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija1?.data?.jagungProduksi} />
                        </div>
                        <hr className='my-2' />
                        <div className="font-semibold mb-2 text-sm md:text-lg">Kedelai</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija1?.data?.kedelaiPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija1?.data?.kedelaiProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija1?.data?.kedelaiProduksi} />
                        </div>
                        <hr className='my-2' />
                        <div className="font-semibold mb-2 text-sm md:text-lg">Kacang Tanah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija1?.data?.kacangTanahPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija1?.data?.kacangTanahProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija1?.data?.jagungProduksi} />
                        </div>
                    </div>
                    
                </div>
                {/* total jumlah */}
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailPalawija1Page