"use client"

import React from 'react'
import AlertIcon from '../../../../../../../public/icons/AlertIcon'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface LabelProps {
    label?: string;
    value?: string | number;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div className='flex gap-2 justify-between lg:justify-start lg:block lg:flex-none'>
            <div className="label text-black">{props.label || '-'}</div>
            <div className="name text-black/70">{props.value || '-'}</div>
        </div>
    )
}

const DetailTanamanBiofarmaka = () => {
    // INTEGRASI
    interface KorluhTanamanBiofarmakaResponse {
        status: number;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        korluhTanamanBiofarmakaId: number;
        namaTanaman: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        rerataHarga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        korluhTanamanBiofarmaka: DetailItem;
    }

    interface DetailItem {
        id: number;
        kecamatanId: number;
        desaId: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string;
        updatedAt: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const params = useParams();
    const { id } = params;

    const { data: detailTanamanBiofarmaka, error } = useSWR<KorluhTanamanBiofarmakaResponse>(
        `/korluh/tanaman-biofarmaka/get/${id}`,
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
    if (!detailTanamanBiofarmaka) return <div>Loading...</div>;

    const data = detailTanamanBiofarmaka?.data;

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail
                Laporan Tanaman Biofarmaka</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/bpp-kecamatan/tanaman-biofarmaka" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data  Tanaman Biofarmaka</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <LabelDetail label="Nama Tanaman" value={data?.namaTanaman} />
                    <LabelDetail label="Luas Panen Habis" value={data?.luasPanenHabis} />
                    <LabelDetail label="Luas Panen Belum Habis" value={data?.luasPanenBelumHabis} />
                    <LabelDetail label="Luas Rusak/Tidak Berhasil/Puso (m2)" value={data?.luasRusak} />
                    <LabelDetail label="Luas Penanaman Baru/Tambah Tanam (m2)" value={data?.luasPenanamanBaru} />
                    <LabelDetail label="Dipanen Habis" value={data?.produksiHabis} />
                    <LabelDetail label="Belum Habis" value={data?.produksiBelumHabis} />
                    <LabelDetail label="Rata-rata Harga Jual di Petaniper Kilogram (Rupiah)" value={data?.rerataHarga} />
                    <LabelDetail label="Keterangan" value={ data?.keterangan} />
                </div>
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailTanamanBiofarmaka
