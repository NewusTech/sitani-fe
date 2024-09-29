"use client"

import React from 'react'
import AlertIcon from '../../../../../../../public/icons/AlertIcon'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70">{props.value || '-'}</div>
        </div>
    )
}

const DetailTanamanBiofarmaka = () => {
    // INTEGRASI
    interface KorluhTanamanBiofarmakaResponse {
        status: number;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        korluhTanamanBiofarmakaId: number;
        namaTanaman: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        rerataHarga: number;
        keterangan: string;
        master: {
            nama: string;
        };
        createdAt: string;
        updatedAt: string;
        korluhTanamanBiofarmaka: DetailItem;
    }

    interface DetailItem {
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

    const { data: detailTanamanBiofarmaka, error } = useSWR<KorluhTanamanBiofarmakaResponse>(
        `/korluh/tanaman-biofarmaka/get/${id}`,
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
    if (!detailTanamanBiofarmaka) return <div>Loading...</div>;

    const data = detailTanamanBiofarmaka?.data;

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-0 md:mb-4 font-semibold text-primary">Detail
                Detail Tanaman Biofarmaka</div>
            {/* title */}
            <div className="mb-4 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/korluh/tanaman-biofarmaka" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-xs md:text-sm'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            {/* mobile */}
            <div className="wrap-table md:hidden">
                <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 lg:mt-3 rounded-lg">
                    <div className="font-semibold mb-2 text-sm md:text-base text-center">Detail Data Tanaman Biofarmaka</div>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        <LabelDetail label="Nama Tanaman" value={data?.master.nama} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <Accordion type="single" collapsible className="w-full text-xs md:text-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="hover:pl-0 text-black p-0 text-xs">
                                    Luas Panen (m2)
                                </AccordionTrigger>
                                <AccordionContent className="text-xs md:text-sm text-black/70 pt-2">
                                    <LabelDetail label="Luas Panen Habis" value={data?.luasPanenHabis} />
                                    <LabelDetail label="Luas Panen Belum Habis" value={data?.luasPanenBelumHabis} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Luas Rusak/Tidak Berhasil/Puso (m2)" value={data?.luasRusak} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Luas Penanaman Baru / Tambah Tanam (Hektar)" value={data?.luasPenanamanBaru} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <Accordion type="single" collapsible className="w-full text-xs md:text-sm">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="hover:pl-0 text-black p-0 text-xs">
                                    Produksi (Kilogram)
                                </AccordionTrigger>
                                <AccordionContent className="text-xs md:text-sm text-black/70 pt-2">
                                    <LabelDetail label="Dipanen Habis" value={data?.produksiHabis} />
                                    <LabelDetail label="Belum Habis" value={data?.produksiBelumHabis} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Rata-rata Harga Jual di Petaniper Kilogram (Rupiah)" value={data?.rerataHarga} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <LabelDetail label="Keterangan" value={data?.keterangan} />
                    </div>
                </div>
            </div>
            {/* mobile */}


            {/* dekstop */}
            <div className="hidden md:block">
                <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                    <div className="font-semibold mb-2 text-lg uppercase">Detail Tanaman Biofarmaka</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        <LabelDetail label="Nama Tanaman" value={data?.master.nama} />
                        <LabelDetail label="Luas Panen Habis" value={data?.luasPanenHabis} />
                        <LabelDetail label="Luas Panen Belum Habis" value={data?.luasPanenBelumHabis} />
                        <LabelDetail label="Luas Rusak/Tidak Berhasil/Puso (m2)" value={data?.luasRusak} />
                        <LabelDetail label="Luas Penanaman Baru/Tambah Tanam (m2)" value={data?.luasPenanamanBaru} />
                        <LabelDetail label="Dipanen Habis" value={data?.produksiHabis} />
                        <LabelDetail label="Belum Habis" value={data?.produksiBelumHabis} />
                        <LabelDetail label="Rata-rata Harga Jual di Petaniper Kilogram (Rupiah)" value={data?.rerataHarga} />
                        <LabelDetail label="Keterangan" value={data?.keterangan} />
                    </div>
                </div>
                {/* detail */}
            </div>
        </div>
    )
}

export default DetailTanamanBiofarmaka
