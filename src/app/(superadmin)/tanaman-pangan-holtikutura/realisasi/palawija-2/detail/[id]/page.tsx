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
    tphRealisasiPalawija2Id: number;
    kecamatanId: number;
    kacangHijauPanen: number;
    kacangHijauProduktivitas: number;
    kacangHijauProduksi: number;
    ubiKayuPanen: number;
    ubiKayuProduktivitas: number;
    ubiKayuProduksi: number;
    ubiJalarPanen: number;
    ubiJalarProduktivitas: number;
    ubiJalarProduksi: number;
    createdAt: string;
    updatedAt: string;
    tphRealisasiPalawija2: TphRealisasiPalawija2;
    kecamatan: Kecamatan;
}

interface TphRealisasiPalawija2 {
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

const DetailPalawija2Page = () => {
    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailPalawija2, error } = useSWR<Response>(
        `/tph/realisasi-palawija-2/get/${id}`,
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
    if (!detailPalawija2) return <div>Loading...</div>;

    const data = detailPalawija2.data;
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Palawija 2</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Palawija 2</div>
                <div className="wrap text-sm">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Kecamatan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Nama' value={detailPalawija2?.data?.kecamatan.nama} />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Jagung</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija2?.data?.kacangHijauPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija2?.data?.kacangHijauProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija2?.data?.kacangHijauProduksi} />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kedelai</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija2?.data?.ubiKayuPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija2?.data?.ubiKayuProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija2?.data?.ubiKayuProduksi} />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kacang Tanah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' value={detailPalawija2?.data?.ubiJalarPanen} />
                            <LabelDetail label='Produktivitas (ku/ha)' value={detailPalawija2?.data?.ubiJalarProduktivitas} />
                            <LabelDetail label='Produksi (ton)' value={detailPalawija2?.data?.ubiJalarProduksi} />
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

export default DetailPalawija2Page