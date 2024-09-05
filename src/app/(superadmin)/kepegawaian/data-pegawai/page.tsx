"use client";

import { Input } from '@/components/ui/input'
import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import HapusIcon from '../../../../../public/icons/HapusIcon'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
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
import DeletePopup from '@/components/superadmin/PopupDelete'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Response {
  status: string,
  data: ResponseData,
  message: string
}

interface ResponseData {
  data: Data[]
}

interface Data {
  id?: number;
  nama?: string;
  nip?: number;
  tempatLahir?: string;
  tglLahir?: string;
  pangkat?: string;
  golongan?: string;
  tmtPangkat?: string;
  jabatan?: string;
  tmtJabatan?: string;
  namaDiklat?: string;
  tglDiklat?: string;
  totalJam?: number;
  namaPendidikan?: string;
  tahunLulus?: number;
  jenjangPendidikan?: string;
  usia?: string;
  masaKerja?: string;
  keterangan?: string;
  status?: string;
}

const DataPegawaiPage = () => {
  const [startDate, setstartDate] = React.useState<Date>();
  const [endDate, setendDate] = React.useState<Date>();

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  const { data: dataKepegawaian }: SWRResponse<Response> = useSWR(
    `/kepegawaian/get`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res?.data)
  );

  console.log(dataKepegawaian)

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/kepegawaian/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(id)
      mutate('/kepegawaian/get');
    } catch (error) {
      console.error('Failed to delete:', error);
      console.log(id)
    }
  };

  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Data Pegawai</div>
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
            <TableHead className="text-primary py-1">No</TableHead>
            <TableHead className="text-primary py-1">Nama/NIP
              <br /> Tempat/Tgl Lahir</TableHead>
            <TableHead className="text-primary py-1">Pangkat/Gol Ruang
              <br />
              TMT Pangkat</TableHead>
            <TableHead className="text-primary py-1">
              Jabatan <br />
              TMT Jabatan
            </TableHead>
            <TableHead className="text-primary py-1">Diklat Struktural</TableHead>
            <TableHead className="text-primary py-1">Pendidikan Umum</TableHead>
            <TableHead className="text-primary py-1">Usia</TableHead>
            <TableHead className="text-primary py-1">Masa Kerja</TableHead>
            <TableHead className="text-primary py-1">Ket</TableHead>
            <TableHead className="text-primary py-1">Status</TableHead>
            <TableHead className="text-primary py-1 ">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataKepegawaian?.data.data && dataKepegawaian?.data.data.length > 0 ? (
            dataKepegawaian?.data.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.nama} <br />
                  {item.nip} <br />
                  {item.tempatLahir}, {item.tglLahir}
                </TableCell>
                <TableCell>
                  {item.pangkat} / {item.golongan} <br />
                  TMT: {item.tmtPangkat}
                </TableCell>
                <TableCell>
                  {item.jabatan} <br />
                  TMT: {item.tmtJabatan}
                </TableCell>
                <TableCell>
                  Nama Diklat: {item.namaDiklat} <br />
                  Tanggal: {item.tglDiklat} <br />
                  Jam: {item.totalJam} Jam
                </TableCell>
                <TableCell>
                  Nama: {item.namaPendidikan} <br />
                  Tahun Lulus: {item.tahunLulus} <br />
                  Jenjang: {item.jenjangPendidikan}
                </TableCell>
                <TableCell>{item.usia}</TableCell>
                <TableCell>{item.masaKerja}</TableCell>
                <TableCell>{item.keterangan}</TableCell>
                <TableCell>
                  <div className="p-1 text-xs rounded bg-slate-200 text-center">
                    {item.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Link className='' href={`/kepegawaian/data-pegawai/detail-pegawai/${item.id}`}>
                      <EyeIcon />
                    </Link>
                    <Link className='' href={`/kepegawaian/data-pegawai/edit-pegawai/${item.id}`}>
                      <EditIcon />
                    </Link>
                    <DeletePopup onDelete={() => handleDelete(String(item.id) || "")} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
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

export default DataPegawaiPage