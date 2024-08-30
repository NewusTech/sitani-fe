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

interface Data {
  komoditas?: string;
  harga?: string;
  keterangan?: string;
}

const ProdusenDanEceran = () => {
  const data: Data[] = [
    {
      komoditas: "Melinting, Braja Selebah, Labuhan Maringgai",
      harga: "Hardono, S.P",
      keterangan: "Keterangan"
    },
    {
      komoditas: "Melinting, Braja Selebah, Labuhan Maringgai",
      harga: "Hardono, S.P",
      keterangan: "Keterangan"
    },
  ];
  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-4 font-semibold text-primary uppercase">Daftar Harga Produsen dan Eceran</div>
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
          <div className="filter-table w-[40px] h-[40px]">
            <Button variant="outlinePrimary" className=''>
              <FilterIcon />
            </Button>
          </div>
        </div>
        <div className="right">
          <Link href="/ketahanan-pangan/produsen-dan-eceran/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
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
            <TableHead className="text-primary py-3">Harga</TableHead>
            <TableHead className="text-primary py-3">Keterangan</TableHead>
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
                {item.harga}
              </TableCell>
              <TableCell>
                {item.keterangan}
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

export default ProdusenDanEceran