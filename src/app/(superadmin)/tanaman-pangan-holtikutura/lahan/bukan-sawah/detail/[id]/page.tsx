"use client"

import React, { useState } from 'react'
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

interface TphLahanBukanSawah {
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

interface LahanBukanSawahData {
    id: number;
    tphLahanBukanSawahId: number;
    kecamatanId: number;
    tegal: number;
    ladang: number;
    perkebunan: number;
    hutanRakyat: number;
    padangPengembalaanRumput: number;
    hutanNegara: number;
    smtTidakDiusahakan: number;
    lainnya: number;
    jumlahLahanBukanSawah: number;
    lahanBukanPertanian: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    tphLahanBukanSawah: TphLahanBukanSawah;
    kecamatan: Kecamatan;
}

interface Response {
    status: number;
    message: string;
    data: LahanBukanSawahData;
}

const DetailBukanLahanSawahPage = () => {

    // Submit handler for form
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataLahanSawah, error } = useSWR<Response>(
        `tph/lahan-bukan-sawah/get/${id}`,
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
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Detail Bukan Lahan Sawah</div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/lahan" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Bukan Lahan Sawah</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <LabelDetail label='Kecamatan' name={dataLahanSawah?.data.kecamatan.nama} />
                        </div>
                    </div>
                    <hr className='my-2' />
                    <div className="wr">
                        <div className="font-semibold mb-2 text-sm md:text-lg">Luas Lahan Bukan Sawah (Ha)</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Tegal/Kebun' name={dataLahanSawah?.data.tegal} />
                            <LabelDetail label='Ladang/Huma' name={dataLahanSawah?.data.ladang} />
                            <LabelDetail label='Perkebunan' name={dataLahanSawah?.data.perkebunan} />
                            <LabelDetail label='Hutan Rakyat' name={dataLahanSawah?.data.hutanRakyat} />
                            <LabelDetail label='Padang Penggembalaan Rumput' name={dataLahanSawah?.data.padangPengembalaanRumput} />
                            <LabelDetail label='Hutan Negara' name={dataLahanSawah?.data.hutanNegara} />
                            <LabelDetail label='Smt. Tidak Diusahakan' name={dataLahanSawah?.data.smtTidakDiusahakan} />
                            <LabelDetail label='Lainnya Tambak, Kolam Empang' name={dataLahanSawah?.data.lainnya} />
                            <LabelDetail label='Jumlah Lahan Bukan Sawah' name={dataLahanSawah?.data.jumlahLahanBukanSawah} />
                        </div>
                    </div>
                    <hr className='my-2' />
                    <div className="wr">
                        <div className="font-semibold mb-2 text-sm md:text-lg">Lahan Bukan Pertanian</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Jalan, Pemukiman, Perkantoran, Sungai' name={dataLahanSawah?.data.lahanBukanPertanian} />
                            <LabelDetail label='Total' name={dataLahanSawah?.data.total} />
                        </div>
                    </div>
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailBukanLahanSawahPage