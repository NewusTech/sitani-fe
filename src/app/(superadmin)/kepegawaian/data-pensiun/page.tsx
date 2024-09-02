"use client"

import { Input } from '@/components/ui/input'
import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
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

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Data {
  nama?: string;
  nip?: string;
  tempat?: string;
  tanggalLahir?: string;
  pangkatGol?: string;
  tmtPangkat?: string;
  jabatan?: string;
  tmtJabatan?: string;
  diklatStruktural?: {
    nama?: string;
    tanggal?: string;
    jam?: string;
  };
  pendidikanUmum: {
    nama: string;
    tahunLulus: string;
    jenjang: string;
  };
  usia?: number;
  masaKerja?: string;
  keterangan?: string;
}

const DataPensiunPage = () => {
  const [startDate, setstartDate] = React.useState<Date>()
  const [endDate, setendDate] = React.useState<Date>()

  const data: Data[] = [
    {
      nama: "John Doe",
      nip: "123456789",
      tempat: "Jakarta",
      tanggalLahir: "1990-01-01",
      pangkatGol: "Pembina Utama IV/a",
      tmtPangkat: "2022-01-01",
      jabatan: "Manager",
      tmtJabatan: "2023-01-01",
      diklatStruktural: {
        nama: "Diklat Kepemimpinan",
        tanggal: "2021-01-01",
        jam: "40 Jam",
      },
      pendidikanUmum: {
        nama: "Universitas XYZ",
        tahunLulus: "2012",
        jenjang: "S1",
      },
      usia: 34,
      masaKerja: "12 Tahun",
      keterangan: "Aktif",
    },
  ];

  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Data Pensiun</div>
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
          <div className="hidden m filter-table w-[40px] h-[40px]">
            <Button variant="outlinePrimary" className=''>
              <FilterIcon />
            </Button>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full mt-4">
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
      {/* top */}

      {/* table */}
      <Table className='border border-slate-200 mt-4'>
        <TableHeader className='bg-primary-600'>
          <TableRow >
            <TableHead className="text-primary py-3">No</TableHead>
            <TableHead className="text-primary py-3">Nama/NIP
              <br /> Tempat/Tgl Lahir</TableHead>
            <TableHead className="text-primary py-3">Pangkat/Gol Ruang
              <br />
              TMT Pangkat</TableHead>
            <TableHead className="text-primary py-3">
              Jabatan <br />
              TMT Jabatan
            </TableHead>
            <TableHead className="text-primary py-3">Diklat Struktural</TableHead>
            <TableHead className="text-primary py-3">Pendidikan Umum</TableHead>
            <TableHead className="text-primary py-3">Usia</TableHead>
            <TableHead className="text-primary py-3">Masa Kerja</TableHead>
            <TableHead className="text-primary py-3">Ket</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {index + 1}
              </TableCell>
              <TableCell>
                {item.nama} <br />
                {item.nip} <br />
                {item.tempat}, {item.tanggalLahir}
              </TableCell>
              <TableCell>
                {item.pangkatGol} <br />
                TMT: {item.tmtPangkat}
              </TableCell>
              <TableCell>
                {item.jabatan} <br />
                TMT: {item.tmtJabatan}
              </TableCell>
              <TableCell>
                Nama Diklat: {item.diklatStruktural?.nama} <br />
                Tanggal: {item.diklatStruktural?.tanggal} <br />
                Jam: {item.diklatStruktural?.jam}
              </TableCell>
              <TableCell>
                Nama: {item.pendidikanUmum?.nama} <br />
                Tahun Lulus: {item.pendidikanUmum?.tahunLulus} <br />
                Jenjang: {item.pendidikanUmum?.jenjang}
              </TableCell>
              <TableCell>
                {item.usia}
              </TableCell>
              <TableCell>
                {item.masaKerja}
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

export default DataPensiunPage