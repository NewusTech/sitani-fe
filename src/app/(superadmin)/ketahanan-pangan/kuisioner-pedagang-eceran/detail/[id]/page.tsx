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

const DetailBantuanPage = () => {
    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Data {
        id: number;
        tanggal: string;
        kepangPedagangEceranId: number;
        kepangMasterKomoditasId: number;
        minggu1: number;
        minggu2: number;
        minggu3: number;
        minggu4: number;
        minggu5: number;
        createdAt: string;
        updatedAt: string;
        komoditas: Komoditas;
    }

    interface Response {
        status: number;
        message: string;
        data: Data;
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailKuisionerPedagangEceran, error } = useSWR<Response>(
        `/kepang/pedagang-eceran/get/${id}`,
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
    if (!detailKuisionerPedagangEceran) return <div>Loading...</div>;

    const data = detailKuisionerPedagangEceran.data;

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-2 lg:mb-5 font-semibold text-primary uppercase">Detail Kuisioner Pedagang Eceran</div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-0 lg:mt-4">
                <Link href="/ketahanan-pangan/kuisioner-pedagang-eceran" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 md:text-lg text-base">Kuisioner Data Harian Panel Pedagang Eceran</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label='Komoditas' value={data?.komoditas.nama} />
                    <LabelDetail label='MG I' value={data?.minggu1} />
                    <LabelDetail label='MG II' value={data?.minggu2} />
                    <LabelDetail label='MG III' value={data?.minggu3} />
                    <LabelDetail label='MG IV' value={data?.minggu4} />
                    <LabelDetail label='MG V' value={data?.minggu5} />
                    <LabelDetail label='Rata2 Per Bulan' value={((data?.minggu1 + data?.minggu2 + data?.minggu3 + data?.minggu4 + data?.minggu5) / 5)} />
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailBantuanPage