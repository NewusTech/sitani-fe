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
    irigasiTeknis?: number;
    irigasi12?: number;
    irigasiSederhana?: number;
    irigasiDesa?: number;
    tadahHujan?: number;
    pasangSurut?: number;
    lebak?: number;
    lainnya?: number;
    jumlah?: number;
    ket?: string;
}

const data: Data[] = [
    {
        kecamatan: "Metro Kibang",
        irigasiTeknis: 234,
        irigasi12: 123,
        irigasiSederhana: 345,
        irigasiDesa: 324,
        tadahHujan: 234,
        pasangSurut: 13,
        lebak: 341,
        lainnya: 133,
        jumlah: 324,
        ket: "keterangan",
    },
    {
        kecamatan: "Batanghari",
        irigasiTeknis: 234,
        irigasi12: 123,
        irigasiSederhana: 345,
        irigasiDesa: 324,
        tadahHujan: 234,
        pasangSurut: 13,
        lebak: 341,
        lainnya: 133,
        jumlah: 324,
        ket: "keterangan",
    },
    {
        kecamatan: "Sekampung",
        irigasiTeknis: 234,
        irigasi12: 123,
        irigasiSederhana: 345,
        irigasiDesa: 324,
        tadahHujan: 234,
        pasangSurut: 13,
        lebak: 341,
        lainnya: 133,
        jumlah: 324,
        ket: "keterangan",
    },
];


const LahanSawah = () => {
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
                    <Link href="/tanaman-pangan-holtikutura/lahan/tambah-lahan-sawah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
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
                            Luas Lahan Sawah (Ha)
                        </TableHead>
                        <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                            Ket
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigasi Teknis
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigas 1/2 Teknis
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigasi Sederhana
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Irigasi Desa/Non PU
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Tadah Hujan
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Pasang Surut
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Lebak
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Lainnya
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Jumlah
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
                                {item.irigasiTeknis}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasi12}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasiSederhana}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.irigasiDesa}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.tadahHujan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.pasangSurut}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.lebak}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.lainnya}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.jumlah}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ket}
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
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default LahanSawah