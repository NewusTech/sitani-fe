import Link from 'next/link'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import HeaderDash from '@/components/HeaderDash'
import DashCard from '@/components/DashCard';
import useSWR, { SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';

interface Response {
    status: number;
    message: string;
    data: Data;
}

interface Data {
    kepangProdusenEceran: Kepang[];
    kepangPedagangEceran: Kepang[];
    kepangCvProduksi: KepangCvProduksi[];
    kepangCvProdusen: KepangCvProdusen[];
    hargaTertinggi: number;
    hargaTerendah: number;
}

interface Kepang {
    komoditas: string;
    harga: number;
    satuan?: string; // Optional, since some entries don't have this field
}

interface KepangCvProduksi {
    id: number;
    bulan: string; // ISO date string
    panen: number;
    gkpTkPetani: number;
    gkpTkPenggilingan: number;
    gkgTkPenggilingan: number;
    jpk: number;
    cabaiMerahKeriting: number;
    berasMedium: number;
    berasPremium: number;
    stokGkg: number;
    stokBeras: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

interface KepangCvProdusen {
    komoditas: string;
    mean: number;
    max: number;
    min: number;
}


const DashboardKetahananPangan = () => {
    // State untuk menyimpan nilai yang dipilih
    const [selectedFilter, setSelectedFilter] = useState<string>('year');

    // Fungsi untuk menangani klik tombol
    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
        console.log(filter); // Log nilai yang dipilih ke console
    };

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    console.log("filter = ", selectedFilter);

    const { data: dataKepang }: SWRResponse<Response> = useSWR(
        `/kepang/dashboard/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );


    return (
        <div className=''>
            {/* title */}
            <div className="wrap flex md:flex-row flex-col mb-4 justify-between">
                <div className="md:text-2xl text-xl  font-semibold text-primary uppercase">Dashboard Ketahanan Pangan</div>
                {/* filter */}
                <div className="text-base md:text-lg  flex gap-4">
                    <button
                        className={`${selectedFilter === 'year' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('year')}
                    >
                        Year
                    </button>
                    <button
                        className={`${selectedFilter === 'month' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`${selectedFilter === 'week' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('week')}
                    >
                        Week
                    </button>
                    <button
                        className={`${selectedFilter === 'today' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('today')}
                    >
                        Today
                    </button>
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Harga Produsen Eceran Tertinggi' value={43900} />
                <DashCard label='Harga Produsen Eceran Terendah' value={22414} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Daftar Harga Produsen dan Eceran" link="/ketahanan-pangan/produsen-dan-eceran" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Komoditas</TableHead>
                                <TableHead className="text-primary p-0">Harga</TableHead>
                                <TableHead className="text-primary p-0">Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataKepang?.data.kepangPedagangEceran.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.satuan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Data Harian Panel Pedagangan Eceran" link="/ketahanan-pangan/kuisioner-pedagang-eceran" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Komoditas</TableHead>
                                <TableHead className="text-primary p-0">Rata-rata Perbulan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataKepang?.data.kepangPedagangEceran.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/*  */}
            <div className="tab2 border border-slate-200 my-3 rounded-lg p-4 w-full h-[350px] overflow-auto">
                <HeaderDash label="Data Coefesien Variasi CV Tingkat Produsen" link="/ketahanan-pangan/koefisien-variasi-produsen" />
                {/* table */}
                {/* table */}
                <Table className='mt-1'>
                    <TableHeader className='rounded-md p-0'>
                        <TableRow className='border-none p-0'>
                            <TableHead className="text-primary p-0">Komoditas</TableHead>
                            <TableHead className="text-primary p-0">Rata-rata</TableHead>
                            <TableHead className="text-primary p-0 ">Maksimum</TableHead>
                            <TableHead className="text-primary p-0 ">Minimum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {dataKepang?.data.kepangCvProdusen.map((data, index) => (
                            <TableRow className='border-none p-0 py-1' key={index}>
                                <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                <TableCell className='p-0 py-1'>{data.mean}</TableCell>
                                <TableCell className='p-0 py-1 '>{data.max}</TableCell>
                                <TableCell className='p-0 py-1 '>{data.min}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                {/* table */}
            </div>
            <div className="tab2 border border-slate-200 my-3 rounded-lg p-4 w-full h-[350px] overflow-auto">
                <HeaderDash label="Data Coefesien Variasi CV Tingkat Produksi" link="/ketahanan-pangan/koefisien-variasi-produksi" />
                {/* table */}
                {/* table */}
                <Table className='mt-1'>
                    <TableHeader className='rounded-md p-2'>
                        <TableRow className='border-none p-2'>
                            <TableHead className="text-primary p-2">Bulan</TableHead>
                            <TableHead className="text-primary p-2">Panen</TableHead>
                            <TableHead className="text-primary p-2 ">GKP Tk. Petani</TableHead>
                            <TableHead className="text-primary p-2 ">GKP Tk. Penggilingan</TableHead>
                            <TableHead className="text-primary p-2 ">GKG Tk. Penggilingan</TableHead>
                            <TableHead className="text-primary p-2 ">
                            JPK
                            </TableHead>
                            <TableHead className="text-primary p-2 ">
                            Cabai Merah Keriting
                            </TableHead>
                            <TableHead className="text-primary p-2 ">
                            Beras Medium
                            </TableHead>
                            <TableHead className="text-primary p-2 ">
                            Beras Premium
                            </TableHead>
                            <TableHead className="text-primary p-2 ">
                            Stok GKG
                            </TableHead>
                            <TableHead className="text-primary p-2 ">
                            Stok Beras
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {dataKepang?.data.kepangCvProduksi.map((data, index) => (
                            <TableRow className='border-none p-2 py-1' key={index}>
                            <TableCell className='p-2 py-1'>{data.bulan}</TableCell>
                            <TableCell className='p-2 py-1'>{data.panen}</TableCell>
                            <TableCell className='p-2 py-1'>{data.gkpTkPetani}</TableCell>
                            <TableCell className='p-2 py-1'>{data.gkpTkPenggilingan}</TableCell>
                            <TableCell className='p-2 py-1'>{data.gkgTkPenggilingan}</TableCell>
                            <TableCell className='p-2 py-1'>{data.jpk}</TableCell>
                            <TableCell className='p-2 py-1'>{data.cabaiMerahKeriting}</TableCell>
                            <TableCell className='p-2 py-1'>{data.berasMedium}</TableCell>
                            <TableCell className='p-2 py-1'>{data.berasPremium}</TableCell>
                            <TableCell className='p-2 py-1'>{data.stokGkg}</TableCell>
                            <TableCell className='p-2 py-1'>{data.stokBeras}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>

                </Table>
                {/* table */}
            </div>
            {/* tabel */}
        </div>
    )
}

export default DashboardKetahananPangan
