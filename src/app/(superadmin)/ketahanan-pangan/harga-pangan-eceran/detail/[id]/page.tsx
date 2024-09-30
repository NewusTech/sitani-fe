"use client"

import React from 'react'
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="value text-black/70">{props.value || '-'}</div>
        </div>
    );
};

const DetailHargaPanganPage = () => {
    interface Response {
        status: number;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        harga: Record<string, number>;
        komoditas: Komoditas;
    }

    interface Komoditas {
        id: number;
        nama: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: dataHargaPanganEceran, error } = useSWR<Response>(
        `/kepang/perbandingan-harga/get/${id}`,
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

    if (error) {
        return <div>Error fetching data</div>;
    }

    if (!dataHargaPanganEceran) {
        return <div>Loading...</div>;
    }

    const data = dataHargaPanganEceran?.data;
    const komoditas = data?.komoditas?.nama || '-';
    const hargaPerBulan = data?.harga || {};

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <div>
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Perbandingan Komoditas Harga Panen</div>

            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/ketahanan-pangan/harga-pangan-eceran" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>

            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Detail Komoditas</div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="Nama Komoditas" value={komoditas} />
                </div>

                <div className="font-semibold text-lg mb-2 mt-3 uppercase">Harga per Bulan</div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                    {months.map((month) => (
                        <LabelDetail key={month} label={month} value={hargaPerBulan[month]?.toString() || '-'} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DetailHargaPanganPage;
