"use client"
import React from 'react'
import Link from 'next/link';
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";

interface LabelProps {
    label?: string;
    name?: string;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70">{props.name || '-'}</div>
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
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Realisasi Padi</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Realisasi Padi</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Kecamatan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Nama' name={dataLahanSawah?.data.kecamatan.nama.toString()} />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Lahan Sawah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name={dataLahanSawah?.data.panenLahanSawah.toString()} />
                            <LabelDetail label='Produktivitas (ku/ha)' name={dataLahanSawah?.data.produktivitasLahanSawah.toString()} />
                            <LabelDetail label='Produksi (ton)' name={dataLahanSawah?.data.produksiLahanSawah.toString()} />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Lahan Kering</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name={dataLahanSawah?.data.panenLahanKering.toString()} />
                            <LabelDetail label='Produktivitas (ku/ha)' name={dataLahanSawah?.data.produktivitasLahanKering.toString()} />
                            <LabelDetail label='Produksi (ton)' name={dataLahanSawah?.data.produksiLahanKering.toString()} />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Total</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name={dataLahanSawah?.data.panenTotal.toString()} />
                            <LabelDetail label='Produktivitas (ku/ha)' name={dataLahanSawah?.data.produktivitasTotal.toString()} />
                            <LabelDetail label='Produksi (ton)' name={dataLahanSawah?.data.produksiTotal.toString()} />
                        </div>
                    </div>
                </div>
            
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailPadiPage