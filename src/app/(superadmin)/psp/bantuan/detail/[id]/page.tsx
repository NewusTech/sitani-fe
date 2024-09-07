"use client"

import React from 'react'
import Link from 'next/link';
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import { SWRResponse, mutate } from "swr";

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

const DetailBantuanPage = () => {
    // TES
    interface Kecamatan {
        nama: string;
    }
    interface Desa {
        nama: string;
    }
    interface Bantuan {
        kecamatan: Kecamatan;
        kecamatanId: number;
        desa: Desa;
        desaId: number;
        periode: string;
        jenisBantuan: string;
        keterangan: string;
    }

    interface Response {
        status: string;
        data: Bantuan;
        message: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataBantuan, error } = useSWR<Response>(
        `psp/bantuan/get/${id}`,
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

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Bantuan</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/psp/bantuan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Bantuan</div>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                    <LabelDetail label='Kecamatan' name={dataBantuan?.data.kecamatan?.nama} />
                    <LabelDetail label='Desa' name={dataBantuan?.data?.desa.nama} />
                    <LabelDetail label='Jenis Bantuan' name={dataBantuan?.data.jenisBantuan} />
                    <LabelDetail label='Periode' name={
                        dataBantuan?.data?.periode ?
                            new Date(dataBantuan.data.periode).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })
                            : '-'
                    } />
                    <LabelDetail label='Keterangan' name={dataBantuan?.data.keterangan} />
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailBantuanPage