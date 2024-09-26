"use client"
import React from 'react'
import Link from 'next/link';
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";

interface LabelProps {
    label?: string;
    name?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70 text-end md:text-start">{props.name || '-'}</div>
        </div>
    )
}

interface TphRealisasiPadi {
    id: number;
    bulan: string; // "2024-02-01T07:00:00.000Z"
    createdAt: string;
    updatedAt: string;
}

interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface RealisasiPadiData {
    id: number;
    tphRealisasiPadiId: number;
    kecamatanId: number;
    panenLahanSawah: number;
    produktivitasLahanSawah: number;
    produksiLahanSawah: number;
    panenLahanKering: number;
    produktivitasLahanKering: number;
    produksiLahanKering: number;
    panenTotal: number;
    produktivitasTotal: number;
    produksiTotal: number;
    createdAt: string;
    updatedAt: string;
    tphRealisasiPadi: TphRealisasiPadi;
    kecamatan: Kecamatan;
}

interface Response {
    status: number;
    message: string;
    data: RealisasiPadiData;
}

const DetailPadiPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();
    const { id } = useParams();
    const { data: dataLahanSawah, error } = useSWR<Response>(
        id ? `/tph/realisasi-padi/get/${id}` : null, // Ensure the SWR fetcher only runs if an id is present
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error("Failed to fetch data:", error);
                return null;
            }
        }
    );
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Realisasi Padi</div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Realisasi Padi</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Kecamatan' name={dataLahanSawah?.data.kecamatan.nama ?? "-"} />
                        </div>
                    </div>
                    <hr className='my-2' />
                    <div className="wr">
                        <div className="font-semibold mb-2 text-sm md:text-lg">Lahan Sawah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name={dataLahanSawah?.data?.panenLahanSawah ?? "-"} />
                            <LabelDetail label='Produktivitas (ku/ha)' name={dataLahanSawah?.data?.produktivitasLahanSawah ?? "-"} />
                            <LabelDetail label='Produksi (ton)' name={dataLahanSawah?.data?.produksiLahanSawah ?? "-"} />
                        </div>
                        <hr className='my-2' />
                        <div className="font-semibold mb-2 text-sm md:text-lg">Lahan Kering</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name={dataLahanSawah?.data?.panenLahanKering ?? "-"} />
                            <LabelDetail label='Produktivitas (ku/ha)' name={dataLahanSawah?.data?.produktivitasLahanKering ?? "-"} />
                            <LabelDetail label='Produksi (ton)' name={dataLahanSawah?.data?.produksiLahanKering ?? "-"} />
                        </div>
                        <hr className='my-2' />
                        <div className="font-semibold mb-2 text-sm md:text-lg">Total</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name={dataLahanSawah?.data?.panenTotal ?? "-"} />
                            <LabelDetail label='Produktivitas (ku/ha)' name={dataLahanSawah?.data?.produktivitasTotal ?? "-"} />
                            <LabelDetail label='Produksi (ton)' name={dataLahanSawah?.data?.produksiTotal ?? "-"} />
                        </div>
                    </div>
                </div>

            </div>
            {/* detail */}
        </div>
    )
}

export default DetailPadiPage