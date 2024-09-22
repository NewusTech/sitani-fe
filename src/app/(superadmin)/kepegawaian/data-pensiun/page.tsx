"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// Filter di mobile

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
import FilterTable from '@/components/FilterTable';
import Link from 'next/link';

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
  const { data: dataPensiun, error }: SWRResponse<Response> = useSWR(
    `/kepegawaian/data-pensiun?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`,
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
  // if (!dataPensiun) return <div>
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

  // Filter table
  const columns = [
    { label: "No", key: "no" },
    { label: "Nama/NIP Tempat/Tgl Lahir", key: "namaNip" },
    { label: "Pangkat/Gol Ruang TMT Pangkat", key: "pangkat" },
    { label: "Jabatan", key: "jabatan" },
    { label: "Diklat Struktural", key: "diklat" },
    { label: "Pendidikan Umum", key: "pendidikan" },
    { label: "Usia", key: "usia" },
    { label: "Masa Kerja", key: "masaKerja" },
  ];

  const getDefaultCheckedKeys = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        return ["no", "namaNip", "jabatan", "usia", "masaKerja"];
      } else {
        return ["no", "namaNip", "pangkat", "jabatan", "diklat", "pendidikan", "usia", "masaKerja"];
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
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Data Pegawai Pensiun</div>
      {/* title */}

      {/* Dekstop */}
      <div className="hidden md:block">
        <>
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
              urlApi={`/kepegawaian/data-pensiun?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`}
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
              {/* More Menu */}

              {/* filter kolom */}
              <FilterTable
                columns={columns}
                defaultCheckedKeys={getDefaultCheckedKeys()}
                onFilterChange={handleFilterChange}
              />
              {/* filter kolom */}

              {/* unduh print */}
              <KepegawaianDataPensiunPrint
                urlApi={`/kepegawaian/data-pensiun?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}&bidangId=${selectedBidang}`}
              />
              {/* unduh print */}
            </div>

            {/* Tambah Data */}
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
        <TableHeader className='bg-primary-600'>
          <TableRow>
            {visibleColumns.includes('no') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">No</TableHead>
            )}
            {visibleColumns.includes('namaNip') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">Nama/NIP <br /> Tempat/Tgl Lahir</TableHead>
            )}
            {visibleColumns.includes('pangkat') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">Pangkat/Gol Ruang <br /> TMT Pangkat</TableHead>
            )}
            {visibleColumns.includes('jabatan') && (
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">Jabatan <br /> TMT Jabatan</TableHead>
            )}
            {visibleColumns.includes('diklat') && (
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center ">Diklat Struktural</TableHead>
            )}
            {visibleColumns.includes('pendidikan') && (
              <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center ">Pendidikan Umum</TableHead>
            )}
            {visibleColumns.includes('usia') && (
              <TableHead rowSpan={2} className="text-primary py-1 ">Usia</TableHead>
            )}
            {visibleColumns.includes('masaKerja') && (
              <TableHead rowSpan={2} className="text-primary py-1 ">Masa Kerja</TableHead>
            )}
            {/* <TableHead rowSpan={2} className="text-primary py-1">Aksi</TableHead> */}
          </TableRow>
          <TableRow>
            {visibleColumns.includes('diklat') && (
              <>
                <TableHead className="text-primary py-1  border border-slate-200 text-center">Nama Diklat</TableHead>
                <TableHead className="text-primary py-1  border border-slate-200 text-center">Tanggal</TableHead>
                <TableHead className="text-primary py-1  border border-slate-200 text-center">Jam</TableHead>
              </>
            )}
            {visibleColumns.includes('pendidikan') && (
              <>
                <TableHead className="text-primary py-1  border border-slate-200 text-center">Nama</TableHead>
                <TableHead className="text-primary py-1  border border-slate-200 text-center">Tahun Lulus</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataPensiun?.data.pegawaiSudahPensiun && dataPensiun?.data.pegawaiSudahPensiun.length > 0 ? (
            dataPensiun.data.pegawaiSudahPensiun.map((item, index) => (
              <TableRow key={index}>
                {visibleColumns.includes('no') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {(currentPage - 1) * limit + (index + 1)}
                  </TableCell>
                )}
                {visibleColumns.includes('namaNip') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    {item.nama} <br />
                    {item.nip} <br />
                    {item.tempat_lahir},
                    <span>
                      {item.tgl_lahir && !isNaN(new Date(item.tgl_lahir).getTime())
                        ? formatDate(new Date(item.tgl_lahir))
                        : ' - '}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('pangkat') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    TMT :
                    <span>
                      {item.pangkat && !isNaN(new Date(item.pangkat).getTime())
                        ? formatDate(new Date(item.pangkat))
                        : ' - '}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('jabatan') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>
                    <span>
                      {item.tmt_jabatan && !isNaN(new Date(item.tmt_jabatan).getTime())
                        ? formatDate(new Date(item.tmt_jabatan))
                        : ' - '}
                    </span>
                  </TableCell>
                )}
                {visibleColumns.includes('diklat') && (
                  <>
                    <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.nama_diklat}</TableCell>
                    <TableCell className='py-2 lg:py-4 border border-slate-200'>
                      TMT :
                      {item.tgl_diklat && !isNaN(new Date(item.tgl_diklat).getTime())
                        ? formatDate(new Date(item.tgl_diklat))
                        : ' - '}
                    </TableCell>
                    <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.total_jam} Jam</TableCell>
                  </>
                )}
                {visibleColumns.includes('pendidikan') && (
                  <>
                    <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.nama_pendidikan}</TableCell>
                    <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.tahun_lulus}</TableCell>
                  </>
                )}
                {visibleColumns.includes('usia') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.usia}</TableCell>
                )}
                {visibleColumns.includes('masaKerja') && (
                  <TableCell className='py-2 lg:py-4 border border-slate-200'>{item.masa_kerja}</TableCell>
                )}
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
      <div className="pagi flex items-center justify-end">
        {dataPensiun?.data?.pagination.totalCount as number > 1 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={dataPensiun?.data.pagination.totalPages as number}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {/* pagination */}
    </div>
  )
}

export default DataPegawaiPagePensiun