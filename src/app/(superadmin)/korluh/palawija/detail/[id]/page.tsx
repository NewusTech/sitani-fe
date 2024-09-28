"use client"

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

// Format tanggal yang diinginkan (yyyy/mm/dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

interface LabelProps {
    label?: string;
    value?: string | number | null;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70 text-end md:text-start">{props.value !== null && props.value !== undefined ? props.value : '-'}</div>
        </div>
    );
}

function DetailPalawijaKorluh() {
    interface KorluhPalawijaResponse {
        status: number;
        message: string;
        data: KorluhPalawijaData;
    }

    interface KorluhPalawijaData {
        id: number;
        korluhPalawijaId: number;
        korluhMasterPalawijaId: number;
        lahanSawahPanen: number;
        lahanSawahPanenMuda: number;
        lahanSawahPanenHijauanPakanTernak: number;
        lahanSawahTanam: number;
        lahanSawahPuso: number;
        lahanBukanSawahPanen: number;
        lahanBukanSawahPanenMuda: number;
        lahanBukanSawahPanenHijauanPakanTernak: number;
        lahanBukanSawahTanam: number;
        lahanBukanSawahPuso: number;
        produksi: number | null;
        createdAt: string;
        updatedAt: string;
        korluhPalawija: KorluhPalawija;
        master: MasterPalawija;
    }

    interface KorluhPalawija {
        id: number;
        kecamatanId: number;
        kecamatan: Kecamatan;
        desa: Desa;
        desaId: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
    }

    interface MasterPalawija {
        id: number;
        nama: string;
        hide: boolean;
        createdAt: string;
        updatedAt: string;
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

    const { data: detailPalawija, error } = useSWR<KorluhPalawijaResponse>(
        `/korluh/palawija/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        }
    );

    if (error) return <div>Error loading data...</div>;
    if (!detailPalawija) return <div>Loading...</div>;

    const data = detailPalawija?.data;

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-4 md:mb-4 font-semibold text-primary">Detail Palawija</div>
            {/* back button */}
            <div className="mb-4 flex justify-start gap-2 md:gap-3 mt-0 md:mt-4">
                <Link href="/korluh/palawija" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-xs md:text-sm'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            {/* mobile table */}
            <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
                <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 lg:mt-3 rounded-lg">
                    <div className="font-semibold mb-2 text-sm md:text-base text-center">Detail Data Palawija</div>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {/* Labels with data */}
                        <LabelDetail label="Kecamatan" value={data?.korluhPalawija?.kecamatan?.nama} />
                        <LabelDetail label="Desa" value={data?.korluhPalawija?.desa?.nama} />
                        <LabelDetail label="Tanggal" value={formatDate(data?.korluhPalawija?.tanggal)} />
                        <LabelDetail label="Nama Palawija" value={data?.master?.nama} />
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                        <Accordion type="single" collapsible className="w-full text-xs md:text-sm">
                            <AccordionItem value="item-7">
                                <AccordionTrigger className="hover:pl-0 text-black/70 p-0 pb-2 text-xs">
                                    Lahan Sawah
                                </AccordionTrigger>
                                <AccordionContent className="text-xs md:text-sm text-black/70">
                                    <LabelDetail label="Panen" value={data?.lahanSawahPanen} />
                                    <LabelDetail label="Panen Muda" value={data?.lahanSawahPanenMuda} />
                                    <LabelDetail label="Panen Hijauan Pakan Ternak" value={data?.lahanSawahPanenHijauanPakanTernak} />
                                    <LabelDetail label="Tanam" value={data?.lahanSawahTanam} />
                                    <LabelDetail label="Puso" value={data?.lahanSawahPuso} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <hr className="border border-primary-600 transition-all ease-in-out animate-pulse" />
                        <Accordion type="single" collapsible className="w-full text-xs md:text-sm">
                            <AccordionItem value="item-7">
                                <AccordionTrigger className="hover:pl-0 text-black/70 p-0 pb-2 text-xs">
                                    Lahan Bukan Sawah
                                </AccordionTrigger>
                                <AccordionContent className="text-xs md:text-sm text-black/70">
                                    <LabelDetail label="Panen" value={data?.lahanBukanSawahPanen} />
                                    <LabelDetail label="Panen Muda" value={data?.lahanBukanSawahPanenMuda} />
                                    <LabelDetail label="Panen Hijauan Pakan Ternak" value={data?.lahanBukanSawahPanenHijauanPakanTernak} />
                                    <LabelDetail label="Tanam" value={data?.lahanBukanSawahTanam} />
                                    <LabelDetail label="Puso" value={data?.lahanBukanSawahPuso} />
                                    <LabelDetail label="Produksi" value={data?.produksi || 'Belum ada data'} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                {/* mobile */}
            </div>
            <div className="hidden md:block">
                {/* dekstop */}
                <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 lg:mt-3 rounded-lg">
                    <div className="font-semibold mb-2 text-base md:text-lg">Detail Data Palawija</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                        {/* Labels with data */}
                        <LabelDetail label="Kecamatan" value={data?.korluhPalawija?.kecamatan?.nama} />
                        <LabelDetail label="Desa" value={data?.korluhPalawija?.desa?.nama} />
                        <LabelDetail label="Tanggal" value={formatDate(data?.korluhPalawija?.tanggal)} />
                        <LabelDetail label="Nama Palawija" value={data?.master?.nama} />
                        <LabelDetail label="Lahan Sawah Panen" value={data?.lahanSawahPanen} />
                        <LabelDetail label="Lahan Sawah Panen Muda" value={data?.lahanSawahPanenMuda} />
                        <LabelDetail label="Lahan Sawah Panen Hijauan Pakan Ternak" value={data?.lahanSawahPanenHijauanPakanTernak} />
                        <LabelDetail label="Lahan Sawah Tanam" value={data?.lahanSawahTanam} />
                        <LabelDetail label="Lahan Sawah Puso" value={data?.lahanSawahPuso} />
                        <LabelDetail label="Lahan Bukan Sawah Panen" value={data?.lahanBukanSawahPanen} />
                        <LabelDetail label="Lahan Bukan Sawah Panen Muda" value={data?.lahanBukanSawahPanenMuda} />
                        <LabelDetail label="Lahan Bukan Sawah Panen Hijauan Pakan Ternak" value={data?.lahanBukanSawahPanenHijauanPakanTernak} />
                        <LabelDetail label="Lahan Bukan Sawah Tanam" value={data?.lahanBukanSawahTanam} />
                        <LabelDetail label="Lahan Bukan Sawah Puso" value={data?.lahanBukanSawahPuso} />
                        <LabelDetail label="Produksi" value={data?.produksi || 'Belum ada data'} />
                    </div>
                </div>
                {/* dekstop */}
            </div>
        </div>
    );
}

export default DetailPalawijaKorluh;
