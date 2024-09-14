"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
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
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'

interface Response {
    status: number;
    message: string;
    data: PerkebunanData;
}

interface PerkebunanData {
    data: KecamatanData[];
    pagination: Pagination;
}

interface KecamatanData {
    tahun: number;
    kecamatan: string;
    list: KategoriData[];
}

interface KategoriData {
    kategori: string;
    sumJumlah: number;
    sumTbm: number;
    sumTm: number;
    sumTr: number;
    sumJmlPetaniPekebun: number;
    sumProduktivitas: number;
    sumProduksi: number;
    list: KomoditasData[];
}

interface KomoditasData {
    id: number;
    komoditas: string;
    tbm: number;
    tm: number;
    tr: number;
    jumlah: number;
    produksi: number;
    produktivitas: number;
    jmlPetaniPekebun: number;
    bentukHasil: string;
    keterangan: string;
}

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    links: Links;
}

interface Links {
    prev: string | null;
    next: string | null;
}

// const dataProduksi = {
//     "status": 200,
//     "message": "Get perkebunan successfully",
//     "data": {
//         "data": [
//             {
//                 "tahun": 2024,
//                 "kecamatan": "Metro Kibang",
//                 "list": [
//                     {
//                         "kategori": "TAN. SEMUSIM",
//                         "sumJumlah": 6,
//                         "sumTbm": 2,
//                         "sumTm": 2,
//                         "sumTr": 2,
//                         "sumJmlPetaniPekebun": 2,
//                         "sumProduktivitas": 2,
//                         "sumProduksi": 2,
//                         "list": [
//                             {
//                                 "id": 1,
//                                 "komoditas": "Jagung",
//                                 "tbm": 4324,
//                                 "tm": 4324,
//                                 "tr": 4324,
//                                 "jumlah": 4324,
//                                 "produksi": 4324,
//                                 "produktivitas": 4324,
//                                 "jmlPetaniPekebun": 4324,
//                                 "bentukHasil": "Jagung pipilan",
//                                 "keterangan": "Keterangan"
//                             },
//                             {
//                                 "id": 2,
//                                 "komoditas": "Kedelai",
//                                 "tbm": 4324,
//                                 "tm": 4324,
//                                 "tr": 4324,
//                                 "jumlah": 4324,
//                                 "produksi": 4324,
//                                 "produktivitas": 4324,
//                                 "jmlPetaniPekebun": 4324,
//                                 "bentukHasil": "Kedelai",
//                                 "keterangan": "Keterangan"
//                             }
//                         ]
//                     },
//                     {
//                         "kategori": "TAN. TAHUNAN",
//                         "sumJumlah": 3,
//                         "sumTbm": 1,
//                         "sumTm": 1,
//                         "sumTr": 1,
//                         "sumJmlPetaniPekebun": 1,
//                         "sumProduktivitas": 1,
//                         "sumProduksi": 1,
//                         "list": [
//                             {
//                                 "id": 3,
//                                 "komoditas": "Aren",
//                                 "tbm": 4324,
//                                 "tm": 4324,
//                                 "tr": 4324,
//                                 "jumlah": 4324,
//                                 "produksi": 4324,
//                                 "produktivitas": 4324,
//                                 "jmlPetaniPekebun": 4324,
//                                 "bentukHasil": "Gula merah",
//                                 "keterangan": "Keterangan"
//                             }
//                         ]
//                     },
//                     {
//                         "kategori": "TAN. REMPAH DAN PENYEGAR",
//                         "sumJumlah": 3,
//                         "sumTbm": 1,
//                         "sumTm": 1,
//                         "sumTr": 1,
//                         "sumJmlPetaniPekebun": 1,
//                         "sumProduktivitas": 1,
//                         "sumProduksi": 1,
//                         "list": [
//                             {
//                                 "id": 4,
//                                 "komoditas": "Jahe",
//                                 "tbm": 4324,
//                                 "tm": 4324,
//                                 "tr": 4324,
//                                 "jumlah": 4324,
//                                 "produksi": 4324,
//                                 "produktivitas": 4324,
//                                 "jmlPetaniPekebun": 4324,
//                                 "bentukHasil": "Jahe segar",
//                                 "keterangan": "Keterangan"
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         "pagination": {
//             "page": 1,
//             "perPage": 10,
//             "totalPages": 1,
//             "totalCount": 1,
//             "links": {
//                 "prev": null,
//                 "next": null
//             }
//         }
//     }
// }


const LuasKecPage = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataProduksi }: SWRResponse<Response> = useSWR(
        `/perkebunan/kecamatan/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => {
                    return res.data;
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    return { status: "error", message: "Failed to fetch data" };
                })
        // .then((res: any) => res.data)
    );

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Luas Areal dan Produksi Perkebunan Rakyat ( Kecamatan )</div>
            {/* title */}

            {/* top */}
            <div className="header flex gap-2 justify-between items-center mt-4">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block">
                            Print
                        </div>
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
                <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                    <div className="w-auto">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {startDate ? format(startDate, "PPP") : <span>Tanggal Awal</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar className=''
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setstartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="">-</div>
                    <div className="w-auto">
                        <Popover>
                            <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                    {endDate ? format(endDate, "PPP") : <span>Tanggal Akhir</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setendDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
                    <div className="w-full">
                        <Select >
                            <SelectTrigger>
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Link href="/perkebunan/luas-produksi-kecamatan/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px]'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Komoditi
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Komposisi Luas Areal
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Jumlah
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produksi (Ton)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas Kg/Ha
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Jml. Petani Pekebun (KK)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Bentuk Hasil
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Keterangan
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 text-center">
                            Aksi
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TBM
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TM
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            TR
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataProduksi?.data.data.map((kecamatan, kecamatanIndex) => (
                        <>
                            <TableRow key={`kecamatan-${kecamatanIndex}`}>
                                <TableCell className='border border-slate-200 text-center'>{kecamatanIndex + 1}</TableCell>
                                <TableCell className='border border-slate-200 font-semibold uppercase'>{kecamatan.kecamatan}</TableCell>
                                <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                            </TableRow>
                            {kecamatan.list.map((kategori, kategoriIndex) => (
                                <>
                                    <TableRow key={`kategori-${kecamatanIndex}-${kategoriIndex}`}>
                                        <TableCell className='border border-slate-200 text-center'>
                                            
                                        </TableCell>
                                        <TableCell className='border border-slate-200 font-semibold'>{kategori.kategori}</TableCell>
                                        <TableCell colSpan={9} className='border border-slate-200 font-semibold' />
                                    </TableRow>
                                    {kategori.list.map((komoditas, komoditasIndex) => (
                                        <TableRow key={`komoditas-${kecamatanIndex}-${kategoriIndex}-${komoditasIndex}`}>
                                            <TableCell className='border border-slate-200 text-center'></TableCell>
                                            <TableCell className='border border-slate-200'>{komoditas.komoditas}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.tbm}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.tm}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.tr}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.jumlah}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.produksi}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.produktivitas}</TableCell>
                                            <TableCell className='border text-center border-slate-200'>{komoditas.jmlPetaniPekebun}</TableCell>
                                            <TableCell className='border border-slate-200'>{komoditas.bentukHasil}</TableCell>
                                            <TableCell className='border border-slate-200'>{komoditas.keterangan}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/detail/${komoditas.id}`}>
                                                        <EyeIcon />
                                                    </Link>
                                                    <Link className='' href={`/perkebunan/luas-produksi-kecamatan/edit/${komoditas.id}`}>
                                                        <EditIcon />
                                                    </Link>
                                                    <DeletePopup onDelete={async () => { }} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow key={`jumlah-${kecamatanIndex}-${kategoriIndex}`}>
                                        <TableCell className='border border-slate-200 text-center'></TableCell>
                                        <TableCell className='border italic font-semibold border-slate-200'>
                                            Jumlah {kategori.kategori}
                                        </TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumTbm}</TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumTm}</TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumTr}</TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumJumlah}</TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumProduksi}</TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumProduktivitas}</TableCell>
                                        <TableCell className='border text-center border-slate-200'>{kategori.sumJmlPetaniPekebun}</TableCell>
                                        <TableCell className='border border-slate-200' colSpan={2} />
                                    </TableRow>
                                </>
                            ))}
                        </>
                    ))}
                </TableBody>
            </Table>

            {/* table */}
        </div>
    )
}

export default LuasKecPage