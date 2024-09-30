"use client";

import React from 'react';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

function formatDate(date: string): string {
    const [year, month] = date.split("-");
    // Convert the month to remove leading zeros (e.g., "06" -> "6")
    const formattedMonth = parseInt(month, 10).toString();
    return `${year}/${formattedMonth}`;
}

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="value text-black/70 text-end md:text-start">{props.value || '-'}</div>
        </div>
    );
};

const DetailKoefisienVariasiProdusen = () => {
    interface Response {
        status: number;
        message: string;
        data: DataItem;
    }

    interface DataItem {
        id: number;
        kepangCvProdusenId: number;
        kepangMasterKomoditasId: number;
        nilai: number;
        komoditas: Komoditas;
        kepangCvProdusen: KepangCvProdusen;
    }

    interface Komoditas {
        id: number;
        nama: string;
    }

    interface KepangCvProdusen {
        id: number;
        bulan: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;


    const { data: detailKoefisienVariasiProdusen, error } = useSWR<Response>(
        `/kepang/cv-produsen/get/${id}`,
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
    if (!detailKoefisienVariasiProdusen) return <div>Loading...</div>;

    const data = detailKoefisienVariasiProdusen?.data;
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Koefisien Variasi Produsen</div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/ketahanan-pangan/koefisien-variasi-produsen" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Koefisien Variasi Produsen</div>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                    <LabelDetail label='Komoditas' value={data?.komoditas?.nama} />
                    <LabelDetail
                        label='Bulan'
                        value={new Date(data?.kepangCvProdusen?.bulan).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                    />
                    <LabelDetail label='Nilai' value={data?.nilai} />
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailKoefisienVariasiProdusen