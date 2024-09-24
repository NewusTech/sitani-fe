"use client"

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import AlertIcon from '../../../../../../../public/icons/AlertIcon'; // Pastikan ini dihapus jika tidak digunakan

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
            <div className="label text-black font-semibold">{props.label || '-'}</div>
            <div className="value text-black/70">{props.value || '-'}</div>
        </div>
    );
};

const DetailVariasiProduksi = () => {
    interface KepangCvProduksiResponse {
        status: number;
        message: string;
        data: KepangCvProduksiData;
    }

    interface KepangCvProduksiData {
        id: number;
        bulan: string;
        panen: number;
        gkpTkPetani: number;
        gkpTkPenggilingan: number;
        gkgTkPenggilingan: number;
        jpk: number;
        cabaiMerahKeriting: number;
        berasMedium: number;
        berasPremium: number;
        stokGkg: number;
        stokBeras: number;
        createdAt: string;
        updatedAt: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params ?? {};

    const { data, error, isLoading } = useSWR<KepangCvProduksiResponse>(
        id ? `/kepang/cv-produksi/get/${id}` : null,
        async (url: string) => {
            const response = await axiosPrivate.get(url);
            return response.data;
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const produksiData = data?.data;

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Koefisien Variansi Produksi</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/ketahanan-pangan/koefisien-variasi-produksi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Detail Koefisien Variansi Produksi</div>
                {produksiData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        <LabelDetail
                            label='Bulan'
                            value={new Date(produksiData.bulan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                        />
                        <LabelDetail label='% Panen' value={produksiData.panen} />
                        <LabelDetail label='GKP Tk. Petani' value={produksiData.gkpTkPetani} />
                        <LabelDetail label='GkP Tk. Penggilingan' value={produksiData.gkpTkPenggilingan} />
                        <LabelDetail label='GKG Tk. Penggilingan' value={produksiData.gkgTkPenggilingan} />
                        <LabelDetail label='JPK' value={produksiData.jpk} />
                        <LabelDetail label='Cabai Merah Keriting' value={produksiData.cabaiMerahKeriting} />
                        <LabelDetail label='Beras Medium' value={produksiData.berasMedium} />
                        <LabelDetail label='Beras Premium' value={produksiData.berasPremium} />
                        <LabelDetail label='Stok GKG' value={produksiData.stokGkg} />
                        <LabelDetail label='Stok Beras' value={produksiData.stokBeras} />
                    </div>
                ) : (
                    <div>Data tidak ditemukan</div>
                )}
            </div>
            {/* detail */}
        </div>
    );
};

export default DetailVariasiProduksi;
