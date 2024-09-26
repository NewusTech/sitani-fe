"use client";

import React from 'react';
import Link from 'next/link';
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";

interface LabelProps {
    label?: string;
    name?: string;
}

interface LahanSawahResponse {
    status: number;
    message: string;
    data: LahanSawahData;
}

interface LahanSawahData {
    id: number;
    tphLahanSawahId: number;
    kecamatanId: number;
    irigasiTeknis: number;
    irigasiSetengahTeknis: number;
    irigasiSederhana: number;
    irigasiDesa: number;
    tadahHujan: number;
    pasangSurut: number;
    lebak: number;
    lainnya: number;
    jumlah: number;
    keterangan: string;
    createdAt: string;
    updatedAt: string;
    tphLahanSawah: TphLahanSawah;
    kecamatan: Kecamatan;
}

interface TphLahanSawah {
    id: number;
    tahun: number;
    createdAt: string;
    updatedAt: string;
}

interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

const LabelDetail = ({ label, name }: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{label || '-'}</div>
            <div className="name text-black/70 text-end md:text-start">{name || '-'}</div>
        </div>
    );
};

const DetailLahanSawahPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const router = useRouter();
    const { id } = useParams();
    const { data: dataLahanSawah, error } = useSWR<LahanSawahResponse>(
        id ? `tph/lahan-sawah/get/${id}` : null, // Ensure the SWR fetcher only runs if an id is present
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

    if (error) return <div>Error loading data...</div>;

    return (
        <div>
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Lahan Sawah</div>
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link
                    href="/tanaman-pangan-holtikutura/lahan"
                    className="bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                >
                    Kembali
                </Link>
            </div>
            {dataLahanSawah && (
                <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                    <div className="font-semibold mb-2 text-base md:text-lg">Data Lahan Sawah</div>
                    <div className="wrap">
                        <div className="wr">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                <LabelDetail label="Nama" name={dataLahanSawah?.data.kecamatan?.nama || '-'} />
                            </div>
                        </div>
                        <hr className='my-2' />
                        <div className="wr">
                            <div className="font-semibold mb-2 text-sm md:text-lg">Luas Lahan Sawah (Ha)</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                                <LabelDetail label="Irigasi Teknis" name={dataLahanSawah?.data?.irigasiTeknis?.toString() || '-'} />
                                <LabelDetail label="Irigasi 1/2 Teknis" name={dataLahanSawah?.data?.irigasiSetengahTeknis?.toString() || '-'} />
                                <LabelDetail label="Irigasi Sederhana" name={dataLahanSawah?.data?.irigasiSederhana?.toString() || '-'} />
                                <LabelDetail label="Irigasi Desa/Non PU" name={dataLahanSawah?.data?.irigasiDesa?.toString() || '-'} />
                                <LabelDetail label="Tadah Hujan" name={dataLahanSawah?.data?.tadahHujan?.toString() || '-'} />
                                <LabelDetail label="Pasang Surut" name={dataLahanSawah?.data?.pasangSurut?.toString() || '-'} />
                                <LabelDetail label="Lebak" name={dataLahanSawah?.data?.lebak?.toString() || '-'} />
                                <LabelDetail label="Lainnya" name={dataLahanSawah?.data?.lainnya?.toString() || '-'} />
                                <LabelDetail label="Jumlah" name={dataLahanSawah?.data?.jumlah?.toString() || '-'} />
                                <LabelDetail label="Keterangan" name={dataLahanSawah?.data?.keterangan || '-'} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailLahanSawahPage;
