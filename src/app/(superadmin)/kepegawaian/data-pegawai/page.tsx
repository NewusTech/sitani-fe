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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DeletePopup from '@/components/superadmin/PopupDelete';

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
        <div className="w-1/4">
          <Select >
            <SelectTrigger>
              <SelectValue placeholder="Bidang" className='text-2xl' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BidangA">BidangA</SelectItem>
              <SelectItem value="BidangB">BidangB</SelectItem>
              <SelectItem value="BidangC">BidangC</SelectItem>
            </SelectContent>
          </Select>
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
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
              No
            </TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
              Nama/NIP
              <br /> Tempat/Tgl Lahir
            </TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
              Pangkat/Gol Ruang
              TMT Pangkat
            </TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
              Jabatan <br />
              TMT Jabatan
            </TableHead>
            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center hidden md:table-cell">
              Diklat Struktural
            </TableHead>
            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center hidden md:table-cell">
              Pendidikan Umum
            </TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 hidden md:table-cell">Usia</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 hidden md:table-cell">Masa Kerja</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 hidden md:table-cell">Ket</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1">Status</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1">Aksi</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
              Nama  DIklat
            </TableHead>
            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
              Tanggal
            </TableHead>
            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
              Jam
            </TableHead>
            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
              Nama
            </TableHead>
            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
              Tahun Lulus
            </TableHead>
            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
              Jenjang
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataKepegawaian?.data.data && dataKepegawaian?.data.data.length > 0 ? (
            dataKepegawaian?.data.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className=''>
                  {item.nama} <br />
                  {item.nip} <br />
                  {item.tempatLahir}, {item.tglLahir}
                </TableCell>
                <TableCell className=''>
                  {item.pangkat} / {item.golongan} <br />
                  TMT: {item.tmtPangkat}
                </TableCell>
                <TableCell className=''>
                  {item.jabatan} <br />
                  TMT: {item.tmtJabatan}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item.namaDiklat} <br />
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item.tglDiklat} <br />
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item.totalJam} Jam
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item.namaPendidikan} <br />
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item.tahunLulus} <br />
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {item.jenjangPendidikan}
                </TableCell>
                <TableCell className='hidden md:table-cell'>{item.usia}</TableCell>
                <TableCell className='hidden md:table-cell'>{item.masaKerja}</TableCell>
                <TableCell className='hidden md:table-cell'>{item.keterangan}</TableCell>
                <TableCell className=''>
                  <div className="p-1 text-xs rounded bg-slate-200 text-center">
                    {item.status}
                  </div>
                </TableCell>
                <TableCell className=''>
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