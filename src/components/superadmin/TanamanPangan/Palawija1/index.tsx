"use client";

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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import Link from 'next/link'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '../../PopupDelete'

interface Data {
    kecamatan?: string;
    kacangHijau: {
        panen?: number;
        produktivitas?: number;
        produksi?: number;
    }
    ubiKayu: {
        panen?: number;
        produktivitas?: number;
        produksi?: number;
    }
    ubiJalar: {
        panen?: number;
        produktivitas?: number;
        produksi?: number;
    }
}

const Palawija1 = () => {
    const data: Data[] = [
        {
            kecamatan: "Metro Kibang",
            kacangHijau: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiKayu: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiJalar: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            }
        },
        {
            kecamatan: "Sekampung",
            kacangHijau: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiKayu: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiJalar: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            }
        },
        {
            kecamatan: "Batanghari",
            kacangHijau: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiKayu: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            },
            ubiJalar: {
                panen: 23,
                produktivitas: 345,
                produksi: 23
            }
        },
    ];

    return (
        <div>
            {/* top */}
            <div className="header flex justify-between items-center">
                <div className="search w-[50%]">
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
            <div className="wrap-filter flex flex-wrap justify-between items-center mt-4 ">
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
                    <div className="fil-kect w-[170px]">
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
                    {/* fil tanaman */}
                    <div className="fil-kect w-[185px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Tanaman" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* fil tanaman */}
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right flex gap-3">
                    <Link href="/tanaman-pangan-holtikutura/realisasi/tambah-palawija1" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Palawija 1
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
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Kacang Hijau
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Ubi Kayu
                        </TableHead>
                        <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">
                            Ubi Jalar
                        </TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Panen <br /> (ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produktivitas <br /> (ku/ha)
                        </TableHead>
                        <TableHead className="text-primary py-1 border border-slate-200 text-center">
                            Produksi <br /> (ton)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className='border border-slate-200 text-center'>
                                {index + 1}
                            </TableCell>
                            <TableCell className='border border-slate-200'>
                                {item.kecamatan}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.kacangHijau.panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.kacangHijau.produksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.kacangHijau.produksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiKayu.panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiKayu.produktivitas}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiKayu.produksi}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiJalar.panen}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiJalar.produktivitas}
                            </TableCell>
                            <TableCell className='border border-slate-200 text-center'>
                                {item.ubiJalar.produksi}
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
                    </TableRow>
                </TableBody>
            </Table>
            {/* table */}
           {/* pagination */}
      <div className="pagination md:mb-[0px] mb-[110px] flex md:justify-end justify-center">
        <Pagination className='md:justify-end'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {/* pagination */}
        </div>
    )
}

export default Palawija1