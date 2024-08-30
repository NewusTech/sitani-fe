"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
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

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'

interface Data {
    komoditas?: string;
    mg1?: string;
    mg2?: string;
    mg3?: string;
    mg4?: string;
    mg5?: string;
    rataBulan?: string;

}

const KuisionerPedagangEceran = () => {
    const data: Data[] = [
        {
            komoditas: "Januari",
            mg1: "48700",
            mg2: "48700",
            mg3: "19400",
            mg4: "25350",
            mg5: "25350",
            rataBulan: "25350",
        },
        {
            komoditas: "Januari",
            mg1: "48700",
            mg2: "48700",
            mg3: "19400",
            mg4: "25350",
            mg5: "25350",
            rataBulan: "25350",
        },
    ];
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Data Coefesien Variasi CV Tingkat Produksi</div>
            {/* title */}
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
            <div className="wrap-filter flex justify-between items-center mt-4 ">
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
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right">
                    <Link href="/ketahanan-pangan/kuisioner-pedagang-eceran/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">Komoditas</TableHead>
                        <TableHead className="text-primary py-3">MG I</TableHead>
                        <TableHead className="text-primary py-3">MG II</TableHead>
                        <TableHead className="text-primary py-3">MG III</TableHead>
                        <TableHead className="text-primary py-3">MG IV</TableHead>
                        <TableHead className="text-primary py-3">MG V</TableHead>
                        <TableHead className="text-primary py-3">Rata2 Per komoditas</TableHead>
                        <TableHead className="text-primary py-3">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {item.komoditas}
                            </TableCell>
                            <TableCell>
                                {item.mg1}
                            </TableCell>
                            <TableCell>
                                {item.mg2}
                            </TableCell>
                            <TableCell>
                                {item.mg3}
                            </TableCell>
                            <TableCell>
                                {item.mg4}
                            </TableCell>
                            <TableCell>
                                {item.mg5}
                            </TableCell>
                            <TableCell>
                                {item.rataBulan}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/kepegawaian/data-pegawai/detail-pegawai">
                                        <EyeIcon />
                                    </Link>
                                    <Link className='' href="/kepegawaian/data-pegawai/edit-pegawai">
                                        <EditIcon />
                                    </Link>
                                    <DeletePopup onDelete={() => { }} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
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

export default KuisionerPedagangEceran