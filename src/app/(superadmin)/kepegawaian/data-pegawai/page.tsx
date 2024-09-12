"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
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
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable';
import BidangSelect from '@/components/superadmin/SelectComponent/BidangValue';
import FilterTable from '@/components/FilterTable';

interface Response {
  status: string,
  data: ResponseData,
  message: string
}

interface ResponseData {
  data: Data[];
  pagination: Pagination;
}

interface Pagination {
  page: number,
  perPage: number,
  totalPages: number,
  totalCount: number,
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
  bidang_id?: number;
  bidang?: Bidang;
}

interface Bidang {
  id?: number;
  nama?: string;
  createdAt?: number;
  updatedAt?: number;
}

const DataPegawaiPage = () => {
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();

  // filter date
  const formatDate = (date?: Date): string => {
    if (!date) return ''; // Return an empty string if the date is undefined
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const day = date.getDate();

    return `${year}/${month}/${day}`;
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

  const { data: dataKepegawaian }: SWRResponse<Response> = useSWR(
    `/kepegawaian/get?page=${currentPage}&search=${search}&limit=10&bidangId=${selectedBidang}`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res?.data)
  );

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/kepegawaian/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(id)
      // alert
      Swal.fire({
        icon: 'success',
        title: 'Data berhasil dihapus!',
        text: 'Data sudah disimpan sistem!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
        customClass: {
          title: 'text-2xl font-semibold text-green-600',
          icon: 'text-green-500 animate-bounce',
          timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
        },
        backdrop: `rgba(0, 0, 0, 0.4)`,
      });
      // alert
    } catch (error) {
      console.error('Failed to delete:', error);
      console.log(id)
    } mutate(`/kepegawaian/get?page=${currentPage}&search=${search}&limit=10&bidangId=${selectedBidang}`);
  };

  // const columns = [
  //   { label: "No", key: "no" },
  //   { label: "Nama/NIP Tempat/Tgl Lahir", key: "namaNip" },
  //   { label: "Pangkat/Gol Ruang TMT Pangkat", key: "pangkat" },
  //   { label: "Jabatan", key: "jabatan" },
  //   { label: "Diklat Struktural", key: "diklat" },
  //   { label: "Pendidikan Umum", key: "pendidikan" },
  //   { label: "Usia", key: "usia" },
  //   { label: "Masa Kerja", key: "masaKerja" },
  //   { label: "Ket", key: "keterangan" },
  //   { label: "Status", key: "status" },
  //   { label: "Aksi", key: "aksi" }
  // ];

  // const getDefaultCheckedKeys = () => {
  //   if (window.innerWidth <= 768) {
  //     return ["no", "namaNip", "status", "aksi"];
  //   } else {
  //     return ["no", "namaNip", "pangkat", "jabatan", "diklat", "pendidikan", "usia", "masaKerja", "keterangan", "status", "aksi"];
  //   }
  // };

  // let defaultCheckedKeys = getDefaultCheckedKeys();
  // window.addEventListener('resize', () => {
  //   defaultCheckedKeys = getDefaultCheckedKeys();
  //   console.log(defaultCheckedKeys);
  // });

  // const [visibleColumns, setVisibleColumns] = useState<string[]>(getDefaultCheckedKeys());

  // useEffect(() => {
  //   const handleResize = () => {
  //     setVisibleColumns(getDefaultCheckedKeys());
  //   };
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // const handleFilterChange = (key: string, checked: boolean) => {
  //   setVisibleColumns(prev =>
  //     checked ? [...prev, key] : prev.filter(col => col !== key)
  //   );
  // };

  // Filter table
  // const defaultCheckedKeys = ["no", "namaNip", "pangkat", "jabatan", "diklat", "pendidikan", "usia", "masaKerja", "keterangan", "status", "aksi"];
  const columns = [
    { label: "No", key: "no" },
    { label: "Nama/NIP Tempat/Tgl Lahir", key: "namaNip" },
    { label: "Pangkat/Gol Ruang TMT Pangkat", key: "pangkat" },
    { label: "Jabatan", key: "jabatan" },
    { label: "Diklat Struktural", key: "diklat" },
    { label: "Pendidikan Umum", key: "pendidikan" },
    { label: "Usia", key: "usia" },
    { label: "Masa Kerja", key: "masaKerja" },
    { label: "Ket", key: "keterangan" },
    { label: "Status", key: "status" },
    { label: "Aksi", key: "aksi" }
  ];

  const getDefaultCheckedKeys = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        return ["no", "namaNip", "status", "aksi"];
      } else {
        return ["no", "namaNip", "pangkat", "jabatan", "diklat", "pendidikan", "usia", "masaKerja", "keterangan", "status", "aksi"];
      }
    }
    return [];
  };

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setVisibleColumns(getDefaultCheckedKeys());
    const handleResize = () => {
      setVisibleColumns(getDefaultCheckedKeys());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleFilterChange = (key: string, checked: boolean) => {
    setVisibleColumns(prev =>
      checked ? [...prev, key] : prev.filter(col => col !== key)
    );
  };
  // Filter Table

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
            value={search}
            onChange={handleSearchChange}
            rightIcon={<SearchIcon />}
            className='border-primary py-2'
          />
        </div>
        <div className="btn flex gap-2">
          <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            <UnduhIcon />
            <div className="hidden md:block">
              Download
            </div>
          </Button>
          <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            <PrintIcon />
            <div className="hidden md:block">
              Print
            </div>
          </Button>
        </div>
      </div>
      {/*  */}
      <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full mt-4">
        <div className="w-1/4">
          <BidangSelect
            value={selectedBidang}
            onChange={(value) => {
              setSelectedBidang(value); // Update state with selected value
            }}
          />
        </div>
        <div className="w-[40px] h-[40px]">
          {/* <Button variant="outlinePrimary" className=''>
            <FilterIcon />
          </Button> */}
          <FilterTable
            columns={columns}
            defaultCheckedKeys={getDefaultCheckedKeys()}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      {/* top */}

      {/* table */}
      <Table className='border border-slate-200 mt-4'>
        <TableHeader className='bg-primary-600'>
          <TableRow >
            {visibleColumns.includes('no') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                No
              </TableHead>
            )}
            {visibleColumns.includes('namaNip') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                Nama/NIP
                <br /> Tempat/Tgl Lahir
              </TableHead>
            )}
            {visibleColumns.includes('pangkat') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                Pangkat/Gol Ruang
                TMT Pangkat
              </TableHead>
            )}
            {visibleColumns.includes('jabatan') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                Jabatan <br />
                TMT Jabatan
              </TableHead>
            )}
            {visibleColumns.includes('diklat') && (
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                Diklat Struktural
              </TableHead>
            )}
            {visibleColumns.includes('pendidikan') && (
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center ">
                Pendidikan Umum
              </TableHead>
            )}
            {visibleColumns.includes('usia') && (
              <TableHead rowSpan={2} className="text-primary py-1 ">Usia</TableHead>
            )}
            {visibleColumns.includes('masaKerja') && (
              <TableHead rowSpan={2} className="text-primary py-1 ">Masa Kerja</TableHead>
            )}
            {visibleColumns.includes('keterangan') && (
              <TableHead rowSpan={2} className="text-primary py-1 ">Ket</TableHead>
            )}
            {visibleColumns.includes('status') && (
              <TableHead rowSpan={2} className="text-primary py-1">Status</TableHead>
            )}
            {visibleColumns.includes('aksi') && (
              <TableHead rowSpan={2} className="text-primary py-1">Aksi</TableHead>
            )}
          </TableRow>
          <TableRow>
            {visibleColumns.includes('diklat') && (
              <TableHead className="text-primary py-1  border border-slate-200 text-center">
                Nama  DIklat
              </TableHead>
            )}
            {visibleColumns.includes('diklat') && (
              <TableHead className="text-primary py-1  border border-slate-200 text-center">
                Tanggal
              </TableHead>
            )}
            {visibleColumns.includes('diklat') && (
              <TableHead className="text-primary py-1  border border-slate-200 text-center">
                Jam
              </TableHead>
            )}
            {visibleColumns.includes('pendidikan') && (
              <TableHead className="text-primary py-1  border border-slate-200 text-center">
                Nama
              </TableHead>
            )}
            {visibleColumns.includes('pendidikan') && (
              <TableHead className="text-primary py-1  border border-slate-200 text-center">
                Tahun Lulus
              </TableHead>
            )}
            {visibleColumns.includes('pendidikan') && (
              <TableHead className="text-primary py-1  border border-slate-200 text-center">
                Jenjang
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataKepegawaian?.data.data && dataKepegawaian?.data.data.length > 0 ? (
            dataKepegawaian?.data.data.map((item, index) => (
              <TableRow key={item.id}>
                {visibleColumns.includes('no') && (
                  <TableCell>{index + 1}</TableCell>
                )}
                {visibleColumns.includes('namaNip') && (
                  <TableCell className=''>
                    {item.nama} <br />
                    {item.nip} <br />
                    {item.tempatLahir}, {item.tglLahir}
                  </TableCell>
                )}
                {visibleColumns.includes('pangkat') && (
                  <TableCell className=''>
                    {item.pangkat} / {item.golongan} <br />
                    TMT: {item.tmtPangkat ?
                      new Date(item.tmtPangkat).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                      : '-'}
                  </TableCell>
                )}
                {visibleColumns.includes('jabatan') && (
                  <TableCell className=''>
                    {item.jabatan} <br />
                    TMT:
                    {item.tmtJabatan ?
                      new Date(item.tmtJabatan).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                      : '-'}
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <TableCell className=''>
                    {item.namaDiklat} <br />
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <TableCell className=''>
                    {item.tglDiklat ?
                      new Date(item.tglDiklat).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                      : '-'}
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <TableCell className=''>
                    {item.totalJam} Jam
                  </TableCell>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <TableCell className=''>
                    {item.namaPendidikan} <br />
                  </TableCell>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <TableCell className=''>
                    {item.tahunLulus} <br />
                  </TableCell>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <TableCell className=''>
                    {item.jenjangPendidikan}
                  </TableCell>
                )}
                {visibleColumns.includes('usia') && (
                  <TableCell className=''>{item.usia}</TableCell>
                )}
                {visibleColumns.includes('masaKerja') && (
                  <TableCell className=''>{item.masaKerja}</TableCell>
                )}
                {visibleColumns.includes('keterangan') && (
                  <TableCell className=''>{item.keterangan}</TableCell>
                )}
                {visibleColumns.includes('status') && (
                  <TableCell className=''>
                    <div className="p-1 text-xs rounded bg-slate-200 text-center">
                      {item.status}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes('aksi') && (
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
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={15} className="text-center">
                Tidak ada data
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

export default DataPegawaiPage