"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
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
import DeletePopup from '@/components/superadmin/PopupDelete';
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable';
import BidangSelect from '@/components/superadmin/SelectComponent/BidangValue';
import { Skeleton } from '@/components/ui/skeleton';
import KepegawaianDataPensiunPrint from '@/components/Print/Kepegawaian/DataPensiun';

interface Bidang {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

interface PegawaiSudahPensiun {
  nama: string;
  nip: number;
  tempat_lahir: string;
  tgl_lahir: string;
  pangkat: string;
  golongan: string;
  tmt_pangkat: string;
  jabatan: string;
  tmt_jabatan: string;
  nama_diklat: string;
  tgl_diklat: string;
  total_jam: number;
  nama_pendidikan: string;
  tahun_lulus: number;
  usia: string;
  masa_kerja: string;
  usia_pensiun_tercapai: number;
  bidang: Bidang;
}

interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
  links: {
    prev: string | null;
    next: string | null;
  };
}

interface Response {
  status: number;
  message: string;
  data: {
    pegawaiSudahPensiun: PegawaiSudahPensiun[];
    pagination: Pagination;
  };
}

const DataPegawaiPagePensiun = () => {
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  // filter date
  const formatDate = (date?: Date): string => {
    if (!date) return ''; // Return an empty string if the date is undefined
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two-digit month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit day

    return `${year}-${month}-${day}`;
  };
  const [startDate, setstartDate] = React.useState<Date>()
  const [endDate, setendDate] = React.useState<Date>()
  // Memoize the formatted date to avoid unnecessary recalculations on each render
  const filterStartDate = React.useMemo(() => formatDate(startDate), [startDate]);
  const filterEndDate = React.useMemo(() => formatDate(endDate), [endDate]);
  // filter date   
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  };
  // pagination
  // serach
  const [search, setSearch] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  // serach
  // limit
  const [limit, setLimit] = useState(10);
  // limit
  // State untuk menyimpan id kecamatan yang dipilih
  // const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedBidang, setSelectedBidang] = useState<string>("");

  const { data: dataKepegawaian, error }: SWRResponse<Response> = useSWR(
    `/kepegawaian/data-pensiun?page=${currentPage}&search=${search}&limit=10&bidangId=${selectedBidang}`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res?.data)
  );

  // if (error) return <div>Error loading data</div>;
  // if (!dataKepegawaian) return <div>
  //   <div className="flex justify-center lg:justify-start gap-2 lg:gap-10">
  //     <div className="flex flex-col space-y-3">
  //       <Skeleton className="lg:h-[250px] h-[50px] lg:w-[250px] w-[50px] rounded-xl" />
  //       <div className="space-y-2">
  //         <Skeleton className="h-4 w-[250px]" />
  //         <Skeleton className="h-4 w-[200px]" />
  //       </div>
  //     </div>
  //   </div>
  // </div>;

  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Data Pegawai Pensiun</div>
      {/* title */}

      {/* top */}
      <div className="header flex justify-between items-center">
        <div className="search w-[50%]">
          <Input
            type="text"
            placeholder="Cari"
            value={search}
            onChange={handleSearchChange}
            rightIcon={<SearchIcon />}
            className='border-primary py-2'
          />
        </div>
        {/* unduh */}
        <KepegawaianDataPensiunPrint
          urlApi={`/kepegawaian/data-pensiun?page=${currentPage}&search=${search}&bidangId=${selectedBidang}`}
        />
        {/* unduh */}
      </div>
      {/*  */}
      <div className="wrap-filter left gap-2 lg:gap-2 flex lg:justify-start justify-between items-center w-full mt-4">
        <div className="w-full lg:w-1/4">
          <BidangSelect
            value={selectedBidang}
            onChange={(value) => {
              setSelectedBidang(value);
            }}
          />
        </div>
        <div className="w-[50px] h-full lg:w-[40px] lg:h-[40px]">
          {/* <Button variant="outlinePrimary" className=''>
            <FilterIcon />
          </Button> */}
        </div>
      </div>
      {/* top */}

      {/* table */}
      <Table className='border border-slate-200 mt-4 mb-20 lg:mb-0 text-xs shadow-lg rounded-lg'>
        <TableHeader className='bg-primary-600 shadow-lg'>
          <TableRow>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">No</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">Nama/NIP <br /> Tempat/Tgl Lahir</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">Pangkat/Gol Ruang <br /> TMT Pangkat</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">Jabatan <br /> TMT Jabatan</TableHead>
            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center ">Diklat Struktural</TableHead>
            <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center ">Pendidikan Umum</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 ">Usia</TableHead>
            <TableHead rowSpan={2} className="text-primary py-1 ">Masa Kerja</TableHead>
            {/* <TableHead rowSpan={2} className="text-primary py-1">Aksi</TableHead> */}
          </TableRow>
          <TableRow>
            <TableHead className="text-primary py-1  border border-slate-200 text-center">Nama Diklat</TableHead>
            <TableHead className="text-primary py-1  border border-slate-200 text-center">Tanggal</TableHead>
            <TableHead className="text-primary py-1  border border-slate-200 text-center">Jam</TableHead>
            <TableHead className="text-primary py-1  border border-slate-200 text-center">Nama</TableHead>
            <TableHead className="text-primary py-1  border border-slate-200 text-center">Tahun Lulus</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataKepegawaian?.data.pegawaiSudahPensiun && dataKepegawaian?.data.pegawaiSudahPensiun.length > 0 ? (
            dataKepegawaian.data.pegawaiSudahPensiun.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.nama} <br />
                  {item.nip} <br />
                  {item.tempat_lahir},
                  <span>
                    {item.tgl_lahir && !isNaN(new Date(item.tgl_lahir).getTime())
                      ? formatDate(new Date(item.tgl_lahir))
                      : ' - '}
                  </span>
                </TableCell>
                <TableCell>
                  TMT :
                  <span>
                    {item.pangkat && !isNaN(new Date(item.pangkat).getTime())
                      ? formatDate(new Date(item.pangkat))
                      : ' - '}
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    {item.tmt_jabatan && !isNaN(new Date(item.tmt_jabatan).getTime())
                      ? formatDate(new Date(item.tmt_jabatan))
                      : ' - '}
                  </span>
                </TableCell>
                <TableCell className=''>{item.nama_diklat}</TableCell>
                <TableCell className=''>
                  TMT :
                  {item.tgl_diklat && !isNaN(new Date(item.tgl_diklat).getTime())
                    ? formatDate(new Date(item.tgl_diklat))
                    : ' - '}
                </TableCell>
                <TableCell className=''>{item.total_jam} Jam</TableCell>
                <TableCell className=''>{item.nama_pendidikan}</TableCell>
                <TableCell className=''>{item.tahun_lulus}</TableCell>
                <TableCell className=''>{item.usia}</TableCell>
                <TableCell className=''>{item.masa_kerja}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                Tidak ada Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* table */}

      {/* pagination */}
      <div className="pagi flex items-center lg:justify-end justify-center">
        {dataKepegawaian?.data?.pagination.totalCount as number > 1 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={dataKepegawaian?.data.pagination.totalPages as number}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {/* pagination */}
    </div>
  )
}

export default DataPegawaiPagePensiun