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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';


const DashboardPerkebunan = () => {
    // State untuk menyimpan nilai yang dipilih
    const [selectedFilter, setSelectedFilter] = useState<string>('year');

    // Fungsi untuk menangani klik tombol
    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
        console.log(filter); // Log nilai yang dipilih ke console
    };

    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    // otomatis hitung tahun
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    // const [tahun, setTahun] = React.useState("2024");
    const [tahun, setTahun] = React.useState(() => new Date().getFullYear().toString());
    // otomatis hitung tahun

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    console.log("filter = ", selectedFilter);
    const { data: dataPerkebunan }: SWRResponse<any> = useSWR(
        `/perkebunan/dashboard/get?year=${tahun}&kecamatan=${selectedKecamatan}`,
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
                <div className="md:text-2xl text-xl  font-semibold text-primary uppercase">Dashboard Perkebunan</div>
                {/* filter */}
                <div className="filter flex gap-3 items-center">
                <div className="w-[110px]">
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
                <div className="w-fit">
                    <KecamatanSelect
                        value={selectedKecamatan}
                        onChange={(value) => {
                            setSelectedKecamatan(value); // Update state with selected value
                        }}
                    />
                </div>
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Produksi (Ton)' value={dataPerkebunan?.data?.jumlahProduksi || 0} />
                <DashCard label='Produktivitas (Kg/Ha)' value={dataPerkebunan?.data?.jumlahProduktivitas || 0} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tan. Tahunan" link="/perkebunan/luas-produksi-kecamatan" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditi</TableHead>
                                <TableHead className="text-primary p-1  text-center">Produktivitas</TableHead>
                                <TableHead className="text-primary p-1  text-center">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {dataPerkebunan?.data?.list[1]?.masterIds?.map((i: number, index: any) => (
                                <TableRow className='border-none p-1 py-1' key={index}>
                                    <TableCell className='p-1 py-1'>{dataPerkebunan?.data?.list[1][i].komoditas.nama}</TableCell>
                                    <TableCell className='p-1 py-1  text-center'>{dataPerkebunan?.data?.list[1][i].produksi}</TableCell>
                                    <TableCell className='p-1 py-1  text-center'>{dataPerkebunan?.data?.list[1][i].produktivitas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tan. Semusim" link="/perkebunan/luas-produksi-kecamatan" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditi</TableHead>
                                <TableHead className="text-primary p-1  text-center">Produktivitas</TableHead>
                                <TableHead className="text-primary p-1  text-center">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {dataPerkebunan?.data?.list[2]?.masterIds?.map((i: number, index: any) => (
                                <TableRow className='border-none p-1 py-1' key={index}>
                                    <TableCell className='p-1 py-1'>{dataPerkebunan?.data?.list[2][i].komoditas.nama}</TableCell>
                                    <TableCell className='p-1 py-1 text-center'>{dataPerkebunan?.data?.list[2][i].produksi}</TableCell>
                                    <TableCell className='p-1 py-1 text-center'>{dataPerkebunan?.data?.list[2][i].produktivitas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tan. Rempah" link="/perkebunan/luas-produksi-kecamatan" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditi</TableHead>
                                <TableHead className="text-primary p-1  text-center">Produktivitas</TableHead>
                                <TableHead className="text-primary p-1  text-center">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {dataPerkebunan?.data?.list[3]?.masterIds?.map((i: number, index: any) => (
                                <TableRow className='border-none p-1 py-1' key={index}>
                                    <TableCell className='p-1 py-1'>{dataPerkebunan?.data?.list[3][i].komoditas.nama}</TableCell>
                                    <TableCell className='p-1 py-1 text-center'>{dataPerkebunan?.data?.list[3][i].produksi}</TableCell>
                                    <TableCell className='p-1 py-1  text-center'>{dataPerkebunan?.data?.list[3][i].produktivitas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/* tabel */}
        </div>
    )
}

export default DashboardPerkebunan
