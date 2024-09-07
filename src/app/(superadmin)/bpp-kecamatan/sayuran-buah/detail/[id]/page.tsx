"use client"

import React from 'react';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = ({ label, value }: LabelProps) => {
    return (
        <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
            <div className="label text-black">{label || '-'}</div>
            <div className="name text-black/70">{value || '-'}</div>
        </div>
    );
};

const DetailSayuranBuah = () => {
    interface KorluhSayurBuahResponse {
        status: string;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        korluhSayurBuahId: number;
        namaTanaman: string;
        hasilProduksi: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        rerataHarga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        korluhSayurBuah: KorluhSayurBuah;
    }

    interface KorluhSayurBuah {
        id: number;
        kecamatanId: number;
        desaId: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string;
        updatedAt: string;
    }

    interface Pagination {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        links: {
            prev: string | null;
            next: string | null;
        };
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailSayuranBuah, error } = useSWR<KorluhSayurBuahResponse>(
        id ? `/korluh/sayur-buah/get/${id}` : null,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                console.log('API Response:', response.data); // Log the API response
                return response.data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                throw error; // Re-throw the error for SWR to handle
            }
        }
    );

    if (error) return <div>Error loading data: {error.message}</div>;
    if (!detailSayuranBuah) return <div>Loading...</div>;

    const data = detailSayuranBuah?.data;

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Laporan Sayur Buah</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/bpp-kecamatan/sayuran-buah" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Tanaman Sayuran Buah</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="Nama Tanaman" value={data?.namaTanaman} />
                    <LabelDetail label="Hasil Produksi Yang Dicatat" value={data?.hasilProduksi} />
                    <LabelDetail label="Luas Panen Habis (Hektar)" value={data?.luasPanenHabis} />
                    <LabelDetail label="Luas Panen Belum Habis (Hektar)" value={data?.luasPanenBelumHabis} />
                    <LabelDetail label="Luas Rusak (Hektar)" value={data?.luasRusak} />
                    <LabelDetail label="Luas Penanaman Baru (Hektar)" value={data?.luasPenanamanBaru} />
                    <LabelDetail label="Produksi (Kuintal) Habis" value={data?.produksiHabis} />
                    <LabelDetail label="Produksi (Kuintal) Belum Habis" value={data?.produksiBelumHabis} />
                    <LabelDetail label="Rata-rata Harga Jual di Petani Per Kilogram" value={data?.rerataHarga} />
                    <LabelDetail label="Keterangan" value={data?.keterangan} />
                </div>
            </div>
            {/* detail */}
        </div>
    );
};

export default DetailSayuranBuah;
