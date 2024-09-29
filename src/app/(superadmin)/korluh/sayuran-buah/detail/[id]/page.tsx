"use client"

import React from 'react';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = ({ label, value }: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
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
        master: {
            nama: string;
        }
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
            <div className="text-xl md:text-2xl mb-0 md:mb-4 font-semibold text-primary">Detail Laporan Sayur Buah</div>
            {/* title */}
            <div className="mb-4 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/korluh/sayuran-buah" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-xs md:text-sm'>
                    Kembali
                </Link>
            </div>
            {/* mobile */}
            <div className="wrap-table md:hidden">
                <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 lg:mt-3 rounded-lg">
                    <div className="font-semibold mb-2 text-sm md:text-base text-center">Detail Data Sayur Buah</div>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        <LabelDetail label="Nama Tanaman" value={data?.master.nama} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Hasil Produksi Yang Dicatat" value={data?.hasilProduksi} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <Accordion type="single" collapsible className="w-full text-xs md:text-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="hover:pl-0 text-black p-0 text-xs">
                                    Luas Panen (Hektar)
                                </AccordionTrigger>
                                <AccordionContent className="text-xs md:text-sm text-black/70 pt-2">
                                    <LabelDetail label="Habis /
Dibongkar" value={data?.luasPanenHabis} />
                                    <LabelDetail label="Belum Habis" value={data?.luasPanenBelumHabis} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Luas Rusak / Tidak Berhasil/Puso (Hektar)" value={data?.luasRusak} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Luas Penanaman Baru / Tambah Tanam (Hektar)" value={data?.luasPenanamanBaru} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <Accordion type="single" collapsible className="w-full text-xs md:text-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="hover:pl-0 text-black p-0 text-xs">
                                    Produksi (Kuintal)
                                </AccordionTrigger>
                                <AccordionContent className="text-xs md:text-sm text-black/70 pt-2">
                                    <LabelDetail label="Dipanen Habis / Dibongkar" value={data?.produksiHabis} />
                                    <LabelDetail label="Belum Habis" value={data?.produksiBelumHabis} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Rata-rata Harga Jual di Petani Per Kilogram" value={data?.rerataHarga} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Keterangan" value={data?.keterangan} />
                    </div>
                </div>
            </div>
            {/* mobile */}

            {/* dekstop */}
            <div className="hidden md:block">
                {/* detail */}
                <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                    <div className="font-semibold mb-2 text-lg uppercase">Data Tanaman Sayuran Buah</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        <LabelDetail label="Nama Tanaman" value={data?.master.nama} />
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
            {/* dekstop */}
        </div>
    );
};

export default DetailSayuranBuah;
