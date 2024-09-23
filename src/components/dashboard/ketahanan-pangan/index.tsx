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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

    // otomatis hitung tahun
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    // const [tahun, setTahun] = React.useState("2024");
    const [tahun, setTahun] = React.useState("");
    // otomatis hitung tahun
    const [bulan, setBulan] = React.useState("");

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    console.log("filter = ", selectedFilter);

    const { data: dataKepang }: SWRResponse<Response> = useSWR(
        `/kepang/dashboard/get?limit=&year=${tahun !== "semua" ? tahun : ""}&month=${bulan !== "semua" ? bulan : ""}`,
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
                <div className="wrap flex items-center gap-2">
                <div className="w-[100px]">
                            <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tahun">
                                        {tahun ? tahun : "Tahun"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                                    {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                        const year = startYear + index;
                                        return (
                                            <SelectItem className='text-xs' key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[130px]">
                            <Select
                                onValueChange={(value) => setBulan(value)}
                                value={bulan}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Bulan" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua</SelectItem>
                                    <SelectItem value="1">Januari</SelectItem>
                                    <SelectItem value="2">Februari</SelectItem>
                                    <SelectItem value="3">Maret</SelectItem>
                                    <SelectItem value="4">April</SelectItem>
                                    <SelectItem value="5">Mei</SelectItem>
                                    <SelectItem value="6">Juni</SelectItem>
                                    <SelectItem value="7">Juli</SelectItem>
                                    <SelectItem value="8">Agustus</SelectItem>
                                    <SelectItem value="9">September</SelectItem>
                                    <SelectItem value="10">Oktober</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">Desember</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Harga Produsen Eceran Tertinggi' value={dataKepang?.data?.hargaTertinggi} />
                <DashCard label='Harga Produsen Eceran Terendah' value={dataKepang?.data.hargaTerendah} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Daftar Harga Produsen dan Eceran" link="/ketahanan-pangan/produsen-dan-eceran" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditas</TableHead>
                                <TableHead className="text-primary p-1">Harga</TableHead>
                                <TableHead className="text-primary p-1">Satuan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataKepang?.data.kepangPedagangEceran.map((data, index) => (
                                <TableRow className='border-none p-1 py-1' key={index}>
                                    <TableCell className='p-1 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-1 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-1 py-1'>{data.satuan ?? "-"}</TableCell>
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
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditas</TableHead>
                                <TableHead className="text-primary p-1">Rata-rata Perbulan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataKepang?.data.kepangPedagangEceran.map((data, index) => (
                                <TableRow className='border-none p-1 py-1' key={index}>
                                    <TableCell className='p-1 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-1 py-1'>{data.harga}</TableCell>
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
                    <TableHeader className='rounded-md p-1'>
                        <TableRow className='border-none p-1'>
                            <TableHead className="text-primary p-1">Komoditas</TableHead>
                            <TableHead className="text-primary p-1">Rata-rata</TableHead>
                            <TableHead className="text-primary p-1 ">Maksimum</TableHead>
                            <TableHead className="text-primary p-1 ">Minimum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {dataKepang?.data.kepangCvProdusen.map((data, index) => (
                            <TableRow className='border-none p-1 py-1' key={index}>
                                <TableCell className='p-1 py-1'>{data.komoditas}</TableCell>
                                <TableCell className='p-1 py-1'>{data.mean}</TableCell>
                                <TableCell className='p-1 py-1 '>{data.max}</TableCell>
                                <TableCell className='p-1 py-1 '>{data.min}</TableCell>
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
