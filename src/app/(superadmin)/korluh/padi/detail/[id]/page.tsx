"use client"

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';

// Format tanggal yang diinginkan (yyyy-mm-dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

interface LabelProps {
    label?: string;
    name?: string;
    number?: number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70">{props.name || props.number || '-'}</div>
        </div>
    )
}

function DetailPadiKorluh() {
    // INTEGRASI
    interface Response {
        status: string,
        data: Data,
        message: string
    }

    interface Data {
        id?: number;
        kecamatan?: Kecamatan;
        desa?: Desa;
        tanggal?: string;
        hibrida_bantuan_pemerintah_lahan_sawah_panen?: number;
        hibrida_bantuan_pemerintah_lahan_sawah_tanam?: number;
        hibrida_bantuan_pemerintah_lahan_sawah_puso?: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_panen?: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_tanam?: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_puso?: number;
        unggul_bantuan_pemerintah_lahan_sawah_panen?: number;
        unggul_bantuan_pemerintah_lahan_sawah_tanam?: number;
        unggul_bantuan_pemerintah_lahan_sawah_puso?: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_panen?: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam?: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_puso?: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_panen?: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_tanam?: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_puso?: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen?: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam?: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso?: number;
        lokal_lahan_sawah_panen?: number;
        lokal_lahan_sawah_tanam?: number;
        lokal_lahan_sawah_puso?: number;
        lokal_lahan_bukan_sawah_panen?: number;
        lokal_lahan_bukan_sawah_tanam?: number;
        lokal_lahan_bukan_sawah_puso?: number;
        sawah_irigasi_lahan_sawah_panen?: number;
        sawah_irigasi_lahan_sawah_tanam?: number;
        sawah_irigasi_lahan_sawah_puso?: number;
        sawah_tadah_hujan_lahan_sawah_panen?: number;
        sawah_tadah_hujan_lahan_sawah_tanam?: number;
        sawah_tadah_hujan_lahan_sawah_puso?: number;
        sawah_rawa_pasang_surut_lahan_sawah_panen?: number;
        sawah_rawa_pasang_surut_lahan_sawah_tanam?: number;
        sawah_rawa_pasang_surut_lahan_sawah_puso?: number;
        sawah_rawa_lebak_lahan_sawah_panen?: number;
        sawah_rawa_lebak_lahan_sawah_tanam?: number;
        sawah_rawa_lebak_lahan_sawah_puso?: number;
    }

    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string; // ISO Date string
        updatedAt: string; // ISO Date string
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string; // ISO Date string
        updatedAt: string; // ISO Date string
    }

    interface Pagination {
        page: number,
        perPage: number,
        totalPages: number,
        totalCount: number,
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailPadi, error } = useSWR<Response>(
        `/korluh/padi/get/${id}`,
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
    if (!detailPadi) return <div>Loading...</div>;

    const data = detailPadi?.data;

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Padi BPP Kecamatan</div>
            {/* back button */}
            <div className="mb-4 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/korluh/padi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 lg:mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Detail Data Padi</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="Kecamatan" name={data?.kecamatan?.nama} />
                    <LabelDetail label="Tanggal" name={data?.tanggal ? formatDate(data.tanggal) : ''} />
                    <LabelDetail label="Hibrida Bantuan Pemerintah Lahan Sawah Panen" number={data?.hibrida_bantuan_pemerintah_lahan_sawah_panen} />
                    <LabelDetail label="Hibrida Bantuan Pemerintah Lahan Sawah Tanam" number={data?.hibrida_bantuan_pemerintah_lahan_sawah_tanam} />
                    <LabelDetail label="Hibrida Bantuan Pemerintah Lahan Sawah Puso" number={data?.hibrida_bantuan_pemerintah_lahan_sawah_puso} />
                    <LabelDetail label="Hibrida Non Bantuan Pemerintah Lahan Sawah Panen" number={data?.hibrida_non_bantuan_pemerintah_lahan_sawah_panen} />
                    <LabelDetail label="Hibrida Non Bantuan Pemerintah Lahan Sawah Tanam" number={data?.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam} />
                    <LabelDetail label="Hibrida Non Bantuan Pemerintah Lahan Sawah Puso" number={data?.hibrida_non_bantuan_pemerintah_lahan_sawah_puso} />
                    <LabelDetail label="Unggul Bantuan Pemerintah Lahan Sawah Panen" number={data?.unggul_bantuan_pemerintah_lahan_sawah_panen} />
                    <LabelDetail label="Unggul Bantuan Pemerintah Lahan Sawah Tanam" number={data?.unggul_bantuan_pemerintah_lahan_sawah_tanam} />
                    <LabelDetail label="Unggul Bantuan Pemerintah Lahan Sawah Puso" number={data?.unggul_bantuan_pemerintah_lahan_sawah_puso} />
                    <LabelDetail label="Unggul Bantuan Pemerintah Lahan Bukan Sawah Panen" number={data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen} />
                    <LabelDetail label="Unggul Bantuan Pemerintah Lahan Bukan Sawah Tanam" number={data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam} />
                    <LabelDetail label="Unggul Bantuan Pemerintah Lahan Bukan Sawah Puso" number={data?.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso} />
                    <LabelDetail label="Unggul Non Bantuan Pemerintah Lahan Sawah Panen" number={data?.unggul_non_bantuan_pemerintah_lahan_sawah_panen} />
                    <LabelDetail label="Unggul Non Bantuan Pemerintah Lahan Sawah Tanam" number={data?.unggul_non_bantuan_pemerintah_lahan_sawah_tanam} />
                    <LabelDetail label="Unggul Non Bantuan Pemerintah Lahan Sawah Puso" number={data?.unggul_non_bantuan_pemerintah_lahan_sawah_puso} />
                    <LabelDetail label="Unggul Non Bantuan Pemerintah Lahan Bukan Sawah Panen" number={data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen} />
                    <LabelDetail label="Unggul Non Bantuan Pemerintah Lahan Bukan Sawah Tanam" number={data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam} />
                    <LabelDetail label="Unggul Non Bantuan Pemerintah Lahan Bukan Sawah Puso" number={data?.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso} />
                    <LabelDetail label="Lokal Lahan Sawah Panen" number={data?.lokal_lahan_sawah_panen} />
                    <LabelDetail label="Lokal Lahan Sawah Tanam" number={data?.lokal_lahan_sawah_tanam} />
                    <LabelDetail label="Lokal Lahan Sawah Puso" number={data?.lokal_lahan_sawah_puso} />
                    <LabelDetail label="Lokal Lahan Bukan Sawah Panen" number={data?.lokal_lahan_bukan_sawah_panen} />
                    <LabelDetail label="Lokal Lahan Bukan Sawah Tanam" number={data?.lokal_lahan_bukan_sawah_tanam} />
                    <LabelDetail label="Lokal Lahan Bukan Sawah Puso" number={data?.lokal_lahan_bukan_sawah_puso} />
                    <LabelDetail label="Sawah Irigasi Lahan Sawah Panen" number={data?.sawah_irigasi_lahan_sawah_panen} />
                    <LabelDetail label="Sawah Irigasi Lahan Sawah Tanam" number={data?.sawah_irigasi_lahan_sawah_tanam} />
                    <LabelDetail label="Sawah Irigasi Lahan Sawah Puso" number={data?.sawah_irigasi_lahan_sawah_puso} />
                    <LabelDetail label="Sawah Tadah Hujan Lahan Sawah Panen" number={data?.sawah_tadah_hujan_lahan_sawah_panen} />
                    <LabelDetail label="Sawah Tadah Hujan Lahan Sawah Tanam" number={data?.sawah_tadah_hujan_lahan_sawah_tanam} />
                    <LabelDetail label="Sawah Tadah Hujan Lahan Sawah Puso" number={data?.sawah_tadah_hujan_lahan_sawah_puso} />
                    <LabelDetail label="Sawah Rawa Pasang Surut Lahan Sawah Panen" number={data?.sawah_rawa_pasang_surut_lahan_sawah_panen} />
                    <LabelDetail label="Sawah Rawa Pasang Surut Lahan Sawah Tanam" number={data?.sawah_rawa_pasang_surut_lahan_sawah_tanam} />
                    <LabelDetail label="Sawah Rawa Pasang Surut Lahan Sawah Puso" number={data?.sawah_rawa_pasang_surut_lahan_sawah_puso} />
                    <LabelDetail label="Sawah Rawa Lebak Lahan Sawah Panen" number={data?.sawah_rawa_lebak_lahan_sawah_panen} />
                    <LabelDetail label="Sawah Rawa Lebak Lahan Sawah Tanam" number={data?.sawah_rawa_lebak_lahan_sawah_tanam} />
                    <LabelDetail label="Sawah Rawa Lebak Lahan Sawah Puso" number={data?.sawah_rawa_lebak_lahan_sawah_puso} />
                </div>
            </div>
        </div>
    )
}

export default DetailPadiKorluh;
