import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'

interface Data {
    kecamatan?: string;
    tegalKebun?: number;
    ladangHuma: number;
    perkebunan: number;
    hutanRakyat: number;
    padangRumput: number;
    hutanNegara: number;
    smt: number;
    lainnya: number;
    jumlahLahan: number;
    jalanPemukiman: number;
    total: number;
}

const data: Data[] = [
    {
        kecamatan: "Sekampung",
        tegalKebun: 234,
        ladangHuma: 254,
        perkebunan: 134,
        hutanRakyat: 264,
        padangRumput: 132,
        hutanNegara: 634,
        smt: 954,
        lainnya: 135,
        jumlahLahan: 157,
        jalanPemukiman: 265,
        total: 634,
    },
    {
        kecamatan: "Batanghari",
        tegalKebun: 234,
        ladangHuma: 254,
        perkebunan: 134,
        hutanRakyat: 264,
        padangRumput: 132,
        hutanNegara: 634,
        smt: 954,
        lainnya: 135,
        jumlahLahan: 157,
        jalanPemukiman: 265,
        total: 634,
    },
    {
        kecamatan: "Metro Kibang",
        tegalKebun: 234,
        ladangHuma: 254,
        perkebunan: 134,
        hutanRakyat: 264,
        padangRumput: 132,
        hutanNegara: 634,
        smt: 954,
        lainnya: 135,
        jumlahLahan: 157,
        jalanPemukiman: 265,
        total: 634,
    },
];

const BukanSawah = () => {
    return (
        <div>
            {/* top */}
            <div className="header flex justify-between items-center">
                <div className="search w-[50%] mb-2">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-3">
                    <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
                        <UnduhIcon />
                        Download
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
                        <PrintIcon />
                        Print
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="wrap-filter flex justify-between items-center mt-42">
                <div className="left gap-2 flex justify-start items-center">
                    <div className="">
                        <Input
                            type='date'
                            className='w-fit py-2'
                        />
                    </div>
                    <div className="">to</div>
                    <div className="">
                        <Input
                            type='date'
                            className='w-fit py-2'
                        />
                    </div>
                    <div className="fil-kect w-[185px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right">
                    <Link href="/tanaman-pangan-holtikutura/lahan/tambah-bukan-sawah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}
            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            No
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                            Kecamatan
                        </TableHead>
                        <TableHead colSpan={9} className="text-primary py-1 border border-slate-200 text-center">
                            Lahan Bukan Sawah
                        </TableHead>
                        <TableHead colSpan={1} className="text-primary py-1 border border-slate-200 text-center">
                            Lahan Bukan Pertanian
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Total
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Tegal/Kebun
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Ladang/Huma
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Perkebunan
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Hutan Rakyat
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Padang Penggembalaan Rumput
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Hutan Negara
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Smt. Tidak Diusahakan
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Lainnya Tambah, Kolam Empang
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Jumlah Lahan Bukan Sawah
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Jalan, Pemukiman, Perkantoran, Sungai
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className='border border-slate-200 text-center'>
                                {index + 1}
                            </TableCell>
                            <TableCell className='border border-slate-200 '>
                                {item.kecamatan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.tegalKebun}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ladangHuma}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.perkebunan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.hutanRakyat}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.padangRumput}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.hutanNegara}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.smt}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.lainnya}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.jumlahLahan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.jalanPemukiman}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.total}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className='border border-slate-200'>

                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            Jumlah
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                        <TableCell className='border font-semibold border-slate-200 text-center'>
                            234
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default BukanSawah