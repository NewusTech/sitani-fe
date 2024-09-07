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

const DetailTanamanHias = () => {
    // INTEGRASI
    interface KorluhTanamanHiasResponse {
        status: number;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        korluhTanamanHiasId: number;
        namaTanaman: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        satuanProduksi: string;
        rerataHarga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        korluhTanamanHias: KorluhTanamanHias
    }

    interface KorluhTanamanHias {
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

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailTanamanHias, error } = useSWR<KorluhTanamanHiasResponse>(
        id ? `/korluh/tanaman-hias/get/${id}` : null,
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
    if (!detailTanamanHias) return <div>Loading...</div>;

    const data = detailTanamanHias?.data;

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail
                Laporan Tanaman Hias</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/bpp-kecamatan/tanaman-hias" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Tanaman Hias</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-sm">
                    <LabelDetail label="Nama Tanaman" value={data?.namaTanaman} />
                    <LabelDetail label="Luas Tanaman Akhir Triwulan Yang Lalu (m2)" value="Belum ada" />
                    <LabelDetail label="Luas Panen Habis (m2)" value={data?.luasPanenHabis} />
                    <LabelDetail label="Luas Panen Belum Habis (m2)" value={data?.luasPanenBelumHabis} />
                    <LabelDetail label="Luas Rusak (m2)" value={data?.luasRusak} />
                    <LabelDetail label="Luas Penanaman Baru (m2)" value={data?.luasPenanamanBaru} />
                    <LabelDetail label="Luas Tanaman Akhir Triwulan Laporan (m2))" value={data?.luasPenanamanBaru} />
                    <LabelDetail label="Produksi Habis" value={data?.produksiHabis} />
                    <LabelDetail label="Produksi Belum Habis" value={data?.produksiBelumHabis} />
                    <LabelDetail label="Satuan Produksi" value={data?.produksiBelumHabis} />
                    <LabelDetail label="Rata-rata Harga Jual di Petani Per Satuan Produksi" value={data?.rerataHarga} />
                    <LabelDetail label="Keterangan" value={data?.keterangan} />
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailTanamanHias