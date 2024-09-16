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
        <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
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
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kecamatan )
            </div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/perkebunan/luas-produksi-kecamatan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Luas Areal Kecamatan</div>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                    <LabelDetail label='Kecamatan' name='' />
                    <LabelDetail label='Tahun' name='' />
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