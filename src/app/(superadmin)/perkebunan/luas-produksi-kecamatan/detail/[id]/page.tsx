"use client"
import React from 'react'
import AlertIcon from '../../../../../../../public/icons/AlertIcon'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR, { mutate, SWRResponse } from "swr";
import useLocalStorage from '@/hooks/useLocalStorage';

interface LabelProps {
    label?: string;
    name?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex text-xs md:text-sm justify-between lg:justify-start lg:block lg:flex-none gap-5 md:gap-2'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70">{props.name || '-'}</div>
        </div>
    )
}

const DetaiLuasProduksiKecamatan = () => {
    const params = useParams();
    const { id } = params;
    // GET ONE
    interface KategoriKomoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Perkebunan {
        id: number;
        perkebunanKecamatanId: number;
        masterKategoriKomoditasId: number;
        masterKomoditasId: number;
        tbm: number;
        tm: number;
        tr: number;
        jumlah: number;
        produksi: number;
        produktivitas: number;
        jmlPetaniPekebun: number;
        bentukHasil: string;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        kategoriKomoditas: KategoriKomoditas;
        komoditas: Komoditas;
    }

    interface ApiResponse {
        status: number;
        message: string;
        data: Perkebunan;
    }

    // GET ONE

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataUser }: SWRResponse<ApiResponse> = useSWR(
        `perkebunan/kecamatan/get/${id}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-3 md:mb-5 font-semibold text-primary">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kecamatan )
            </div>
            {/* title */}
            <div className="flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/perkebunan/luas-produksi-kecamatan" className='bg-white px-4 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-5 md:p-6 md:mt-5 mt-3 rounded-lg">
                <div className="font-semibold mb-2 text-base md:text-lg">Data Luas Areal Kecamatan</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label='Kecamatan' name={dataUser?.data?.perkebunanKecamatanId} />
                    <LabelDetail label='Tahun' name={dataUser?.data?.createdAt} />
                    <LabelDetail label='Kategori Komoditas' name={dataUser?.data?.kategoriKomoditas?.nama} />
                    <LabelDetail label='Komoditas' name={dataUser?.data?.komoditas.nama} />
                    <LabelDetail label='TBM' name={dataUser?.data?.tbm} />
                    <LabelDetail label='Produksi' name={dataUser?.data?.produksi} />
                    <LabelDetail label='TM' name={dataUser?.data?.tm} />
                    <LabelDetail label='Jumlah Petani' name={dataUser?.data?.jmlPetaniPekebun} />
                    <LabelDetail label='TR' name={dataUser?.data?.tr} />
                    <LabelDetail label='Produktivitas' name={dataUser?.data?.produktivitas} />
                    <LabelDetail label='Jumlah' name={dataUser?.data?.jumlah} />
                    <LabelDetail label='Bentuk Hasil' name={dataUser?.data?.bentukHasil} />
                    <LabelDetail label='Keterangan' name={dataUser?.data?.keterangan} />
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetaiLuasProduksiKecamatan