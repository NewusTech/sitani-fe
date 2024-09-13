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
        <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="value text-black/70">{props.value || '-'}</div>
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
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Palawija 1</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Palawija 1</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Kecamatan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Nama' value={detailPalawija1?.data?.kecamatan.nama} />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Jagung</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija1?.data?.jagungPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija1?.data?.jagungProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija1?.data?.jagungProduksi} />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kedelai</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija1?.data?.kedelaiPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija1?.data?.kedelaiProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija1?.data?.kedelaiProduksi} />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kacang Tanah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija1?.data?.kacangTanahPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija1?.data?.kacangTanahProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija1?.data?.jagungProduksi} />
                        </div>
                    </div>
                    <hr className='my-2' />
                </div>
                {/* total jumlah */}
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailPalawija1Page