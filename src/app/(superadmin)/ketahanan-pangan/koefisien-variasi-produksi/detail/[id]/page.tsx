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
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70 text-end md:text-start">{props.value || '-'}</div>
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
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Data Koefisien Variansi Produksi</div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/ketahanan-pangan/koefisien-variasi-produksi" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Detail Koefisien Variansi Produksi</div>
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
