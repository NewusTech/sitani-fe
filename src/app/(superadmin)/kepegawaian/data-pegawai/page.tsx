"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'

// Filter di mobile
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import Label from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  Filter,
} from "lucide-react"
import { CalendarDays, Calendar as CalendarIcon, CalendarSearch } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
// Filter di mobile

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import KepegawaianDataPegawaiPrint from '@/components/Print/Kepegawaian/DataPegawai';
import TambahIcon from '../../../../../public/icons/TambahIcon';

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
  nip?: string;
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
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

  // otomatis hitung tahun
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 5;
  const endYear = currentYear + 1;
  // const [tahun, setTahun] = React.useState("2024");
  const [tahun, setTahun] = React.useState(() => new Date().getFullYear().toString());
  // otomatis hitung tahun
  const [selectedBidang, setSelectedBidang] = useState<string>("");

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();
  const { data: dataKepegawaian }: SWRResponse<Response> = useSWR(
    `/kepegawaian/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`,
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
          timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400',
        },
        backdrop: `rgba(0, 0, 0, 0.4)`,
      });
      // alert
    } catch (error) {
      console.error('Failed to delete:', error);
      console.log(id)
    } mutate(`/kepegawaian/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`);
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
        return ["no", "namaNip", "jabatan", "usia", "masaKerja", "status"];
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
    // const handleResize = () => {
    //   setVisibleColumns(getDefaultCheckedKeys());
    // };
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
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
      <div className="text-2xl mb-5 font-semibold text-primary capitalize">Data Pegawai</div>
      {/* title */}

      {/* Dekstop */}
      <div className="hidden md:block">
        <>
          {/* top */}
          <div className="header flex justify-between gap-2 items-center">
            <div className="search w-full lg:w-[50%]">
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
            <KepegawaianDataPegawaiPrint
              urlApi={`/kepegawaian/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`}
            />
            {/* unduh */}
          </div>
          {/*  */}
          <div className="wrap-filter left gap-2 lg:gap-2 flex lg:justify-start justify-between items-center w-full mt-2">
            <div className="w-full lg:w-1/4">
              <BidangSelect
                value={selectedBidang}
                onChange={(value) => {
                  setSelectedBidang(value);
                }}
              />
            </div>
            <div className="w-[50px] h-full lg:w-[40px] lg:h-[40px]">
              <FilterTable
                columns={columns}
                defaultCheckedKeys={getDefaultCheckedKeys()}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
          {/* top */}
        </>
      </div>
      {/* Dekstop */}

      {/* Mobile */}
      <div className="md:hidden">
        <>
          {/* Handle filter menu*/}
          <div className="flex justify-between w-full">
            <div className="flex justify-start w-fit gap-2">
              {/* More Menu */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outlinePrimary"
                          className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                        >
                          <Filter className="text-primary w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md w-fit">
                        <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                          Menu Filter
                        </DropdownMenuLabel>
                        {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                        <div className="bg-white w-full h-full">
                          <div className="flex flex-col w-full px-2 py-2">
                            {/* Filter Kecamatan */}
                            {/* <>
                        <Label className='text-xs mb-1 !text-black opacity-50' label="Kecamatan" />
                        <div className="w-full mb-2">
                          <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                            <SelectTrigger className='text-xs'>
                              <SelectValue placeholder="Tahun">
                                {tahun ? tahun : "Tahun"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                              {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                const year = startYear + index;
                                return (
                                  <SelectItem className='text-xs' key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </> */}
                            {/* Filter Kecamatan */}

                            {/* Filter Desa */}
                            <>
                              <Label className='text-xs mb-1 !text-black opacity-50' label="Bidang" />
                              <div className="w-full mb-2">
                                <BidangSelect
                                  value={selectedBidang}
                                  onChange={(value) => {
                                    setSelectedBidang(value);
                                  }}
                                />
                              </div>
                            </>
                            {/* Filter Desa */}

                            {/* Filter Rentang Tanggal */}
                            <>
                              <Label className='text-xs mb-1 !text-black opacity-50' label="Rentang Tanggal" />
                              <div className="flex gap-2 justify-between items-center w-full mb-2">
                                <div className="w-full">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full flex items-center justify-between text-left font-normal text-[11px] lg:text-sm",
                                          !startDate && "text-muted-foreground"
                                        )}
                                      >
                                        <div className="flex gap-2 justify-between">
                                          <span className="pl-2 text-xs">
                                            {startDate
                                              ? format(startDate, "dd/MM/yyyy", { locale: id })
                                              : "Tanggal Awal"}
                                          </span>
                                          <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                                        </div>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <DatePicker
                                        inline
                                        selected={startDate}
                                        onChange={(date: any) => setstartDate(date)}
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        locale={id}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <div className="text-xs">to</div>
                                <div className="w-full">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full flex items-center justify-between text-left font-normal text-xs lg:text-sm",
                                          !endDate && "text-muted-foreground"
                                        )}
                                      >
                                        <div className="flex gap-2 justify-between">
                                          <span className="pl-2 text-xs">
                                            {endDate
                                              ? format(endDate, "dd/MM/yyyy", { locale: id })
                                              : "Tanggal Akhir"}
                                          </span>
                                          <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                                        </div>
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <DatePicker
                                        inline
                                        selected={endDate}
                                        onChange={(date: any) => setendDate(date)}
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        yearDropdownItemNumber={15}
                                        scrollableYearDropdown
                                        locale={id}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                            </>
                            {/* Filter Rentang Tanggal */}

                            {/* Filter Tahun Bulan */}
                            <>
                              <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Bulan" />
                              <div className="flex gap-2 justify-between items-center w-full">
                                {/* filter tahun */}
                                <div className="w-1/2">
                                  <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tahun">
                                        {tahun ? tahun : "Tahun"}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                                      {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                        const year = startYear + index;
                                        return (
                                          <SelectItem className='text-xs' key={year} value={year.toString()}>
                                            {year}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {/* filter tahun */}
                                {/* Filter bulan */}
                                <div className="w-1/2">
                                  <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Tahun">
                                        {tahun ? tahun : "Tahun"}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                                      {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                        const year = startYear + index;
                                        return (
                                          <SelectItem className='text-xs' key={year} value={year.toString()}>
                                            {year}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {/* Filter bulan */}
                              </div>
                            </>
                            {/* Filter Tahun Bulan */}

                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Menu Filter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* More Menu */}

              {/* filter kolom */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <FilterTable
                      columns={columns}
                      defaultCheckedKeys={getDefaultCheckedKeys()}
                      onFilterChange={handleFilterChange}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter Kolom</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* filter kolom */}

              {/* unduh print */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <KepegawaianDataPegawaiPrint
                      urlApi={`/kepegawaian/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unduh/Print</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* unduh print */}
            </div>

            {/* Tambah Data */}
            <div className="flex justify-end items-center w-fit">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href="/kepegawaian/tambah-pegawai"
                      className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                      {/* Tambah */}
                      <TambahIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tambah Data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Tambah Data */}
          </div>

          {/* Hendle Search */}
          <div className="mt-2 search w-full">
            <Input
              autoFocus
              type="text"
              placeholder="Cari"
              value={search}
              onChange={handleSearchChange}
              rightIcon={<SearchIcon />}
              className='border-primary py-2 text-xs'
            />
          </div>
          {/* Hendle Search */}

        </>
      </div>
      {/* Mobile */}

      {/* table */}
      <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden '>
        <TableHeader className="bg-primary-600">
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
              <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Usia</TableHead>
            )}
            {visibleColumns.includes('masaKerja') && (
              <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Masa Kerja</TableHead>
            )}
            {visibleColumns.includes('keterangan') && (
              <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Ket</TableHead>
            )}
            {visibleColumns.includes('status') && (
              <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Status</TableHead>
            )}
            {visibleColumns.includes('aksi') && (
              <TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">Aksi</TableHead>
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
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>{(currentPage - 1) * limit + (index + 1)}</TableCell>
                )}
                {visibleColumns.includes('namaNip') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.nama} <br />
                    {item.nip === "" ? (
                      <span></span>
                    ) : (
                      <span>{item.nip}</span>
                    )}
                    <br />
                    {item.tempatLahir}, {item.tglLahir}
                  </TableCell>
                )}
                {visibleColumns.includes('pangkat') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.pangkat} / {item.golongan} <br />
                    TMT :
                    <span>
                      {item.tmtPangkat && !isNaN(new Date(item.tmtPangkat).getTime())
                        ? formatDate(new Date(item.tmtPangkat))
                        : ' - '}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('jabatan') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.jabatan} <br />
                    TMT :
                    <span>
                      {item.tmtJabatan && !isNaN(new Date(item.tmtJabatan).getTime())
                        ? formatDate(new Date(item.tmtJabatan))
                        : ' - '}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.namaDiklat} <br />
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    <span>
                      {item.tglDiklat && !isNaN(new Date(item.tglDiklat).getTime())
                        ? formatDate(new Date(item.tglDiklat))
                        : ' - '}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.totalJam === 0 ? (
                      <span></span>
                    ) : (
                      <span>{item.totalJam} Jam</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.namaPendidikan} <br />
                  </TableCell>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.tahunLulus === 0 ? (
                      <span></span>
                    ) : (
                      <span>{item.tahunLulus}</span>
                    )}
                  </TableCell>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.jenjangPendidikan}
                  </TableCell>
                )}
                {visibleColumns.includes('usia') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.usia}</TableCell>
                )}
                {visibleColumns.includes('masaKerja') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.masaKerja}</TableCell>
                )}
                {visibleColumns.includes('keterangan') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.keterangan}</TableCell>
                )}
                {visibleColumns.includes('status') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    <div className="p-1 text-xs rounded bg-slate-200 text-center">
                      {item.status}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes('aksi') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
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
      <div className="pagi flex items-center justify-end">
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