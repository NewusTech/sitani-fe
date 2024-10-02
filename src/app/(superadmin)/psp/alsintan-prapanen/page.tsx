"use client";

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'

// Filter di mobile
import "react-datepicker/dist/react-datepicker.css";
import Label from '@/components/ui/label'
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
import {
  Filter,
} from "lucide-react"
// Filter di mobile

import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EditIcon from '../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../public/icons/EyeIcon'
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
import DeletePopup from '@/components/superadmin/PopupDelete'
import PaginationTable from '@/components/PaginationTable';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import Swal from 'sweetalert2';
import FilterTable from '@/components/FilterTable';
import PSPBantuan from '@/components/Print/PSP/Bantuan';
import TambahIcon from '../../../../../public/icons/TambahIcon';
import NotFoundSearch from '@/components/SearchNotFound';
import DeletePopupTitik from '@/components/superadmin/TitikDelete';
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Prapanen = () => {
  // TES
  interface Response {
    status: number;
    message: string;
    data: Data;
  }

  interface Data {
    data: Item[];
    pagination: Pagination;
  }

  interface Item {
    id: number;
    kecamatanId: number;
    tahun: number;
    tr_4_apbn: number;
    tr_4_tp: number;
    tr_4_apbd: number;
    tr_2_apbn: number;
    tr_2_tp: number;
    tr_2_apbd: number;
    rt_apbn: number;
    rt_tp: number;
    rt_apbd: number;
    cornplanter_apbn: number;
    cornplanter_tp: number;
    cornplanter_apbd: number;
    cultivator_apbn: number;
    cultivator_tp: number;
    cultivator_apbd: number;
    hand_sprayer_apbn: number;
    hand_sprayer_tp: number;
    hand_sprayer_apbd: number;
    pompa_air_apbn: number;
    pompa_air_tp: number;
    pompa_air_apbd: number;
    keterangan: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    kecamatan: Kecamatan;
  }

  interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }

  interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    links: Links;
  }

  interface Links {
    prev: string | null;
    next: string | null;
  }


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

  // filter tahun dinamis
  const [selectedTahun, setSelectedTahun] = useState<string>(new Date().getFullYear().toString());
  // filter tahun dinamis
  const currentYear = new Date().getFullYear();
  const [tahun, setTahun] = React.useState(`${currentYear}`);

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();
  const { data: dataPSP }: SWRResponse<Response> = useSWR(
    `/psp/alsintan-prapanen/get?page=${currentPage}&limit=10&kecamatan=${selectedKecamatan}&year=${tahun === 'semua' ? '' : tahun}`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/psp/alsintan-prapanen/delete/${id}`, {
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
      // Update the local data after successful deletion
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menghapus data!';
      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan!',
        text: errorMessage,
        showConfirmButton: true,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' },
        customClass: {
          title: 'text-2xl font-semibold text-red-600',
          icon: 'text-red-500 animate-bounce',
        },
        backdrop: 'rgba(0, 0, 0, 0.4)',
      });
      console.error("Failed to create user:", error);
    } mutate(`/psp/alsintan-prapanen/get?page=${currentPage}&limit=10&kecamatan=${selectedKecamatan}&year=${tahun === 'semua' ? '' : tahun}`);
  };

  // Filter table
  const columns = [
    { label: "No", key: "no" },
    { label: "Kecamatan", key: "kecamatan" },
    { label: "Desa", key: "desa" },
    { label: "Jenis Bantuan", key: "jenisBantuan" },
    { label: "Periode", key: "periode" },
    { label: "Keterangan", key: "keterangan" },
    { label: "Aksi", key: "aksi" }
  ];

  const getDefaultCheckedKeys = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        return ["no", "kecamatan", "desa", "aksi"];
      } else {
        return ["no", "kecamatan", "desa", "jenisBantuan", "periode", "keterangan", "aksi"];
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
    //     setVisibleColumns(getDefaultCheckedKeys());
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
      <div className="md:text-2xl text-xl mb-5 font-semibold text-primary">Sebaran Alsintan Prapanen</div>
      {/* title */}

      {/* Dekstop */}
      <div className="hidden md:block">
        <>
          {/* top */}
          <div className="header flex gap-2 justify-between items-center mt-4">
            {/* print */}
            {/* <PSPBantuan
              urlApi={`/psp/bantuan/get?page=${currentPage}&search=${search}&limit=10&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
              startDate={filterStartDate}
              endDate={filterEndDate}
              kecamatan={selectedKecamatan}
            /> */}
            {/* print */}
          </div>
          {/*  */}
          <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
            <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
              {/* filter tanggal */}
              {/* filter tanggal */}
              <FilterTable
                columns={columns}
                defaultCheckedKeys={getDefaultCheckedKeys()}
                onFilterChange={handleFilterChange}
              />
              {/* filter tahun */}
              <div className="w-fit">
              <Select
                onValueChange={(value) => setTahun(value)}
                value={tahun}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tahun" className='text-2xl' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2017">2017</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
              </div>
              {/* filter tahun */}
            </div>
            <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
              <div className="w-full">
                <KecamatanSelect
                  label="Kecamatan"
                  placeholder="Pilih Kecamatan"
                  value={selectedKecamatan}
                  onChange={(value) => {
                    setSelectedKecamatan(value); // Update state with selected value
                  }}
                />
              </div>
              <Link href="/psp/alsintan-prapanen/tambah" className='bg-primary px-3 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[180px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                Tambah Data
              </Link>
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
                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md ml-5 w-[280px]">
                  <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                    Menu Filter
                  </DropdownMenuLabel>
                  {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                  <div className="bg-white w-full h-full">
                    <div className="flex flex-col w-full px-2 py-2">
                      {/* Filter Kecamatan */}
                      <div className="w-full">
                        <Label className='text-xs mb-1 !text-black opacity-50' label="Kecamatan" />
                        <div className="w-full mb-2">
                          <KecamatanSelect
                            value={selectedKecamatan}
                            onChange={(value) => {
                              setSelectedKecamatan(value);
                            }}
                          />
                        </div>
                      </div>
                      {/* Filter Kecamatan */}

                      {/* Filter Desa */}
                      {/* Filter Desa */}

                      {/* Filter Rentang Tanggal */}
                      {/* Filter Rentang Tanggal */}

                      {/* Filter Tahun Bulan */}
                      <>
                        <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Bulan" />
                        <div className="flex gap-2 justify-between items-center w-full">
                          {/* filter tahun */}
                          <TahunSelect
                            url='psp/master-tahun/bantuan'
                            semua={true}
                            value={selectedTahun}
                            onChange={(value) => {
                              setSelectedTahun(value);
                            }}
                          />
                          {/* filter tahun */}
                          {/* filter tahun */}
                          {/* Filter bulan */}

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
              {/* <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            /> */}
              {/* filter kolom */}

              {/* unduh print */}
              <PSPBantuan
                urlApi={`/psp/bantuan/get?page=${currentPage}&search=${search}&limit=10&kecamatan=${selectedKecamatan}&startDate=${filterStartDate}&endDate=${filterEndDate}`}
                startDate={filterStartDate}
                endDate={filterEndDate}
                kecamatan={selectedKecamatan}
              />
              {/* unduh print */}
            </div>

            {/* Tambah Data */}
            <div className="flex justify-end items-center w-fit">
              <Link
                href="/psp/bantuan/tambah"
                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                {/* Tambah */}
                <TambahIcon />
              </Link>
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
      <div className="hidden md:block">
        <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden'>
          <TableHeader className='bg-primary-600'>
            <TableRow >
              <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center">No</TableHead>
              <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center">Tahun</TableHead>
              <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center">Kecamatan</TableHead>
              <TableHead colSpan={21} className="text-primary py-1 border border-slate-200 text-center">Jumlah Alsintan</TableHead>
              <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center">Ket</TableHead>
              <TableHead rowSpan={3} className="text-primary py-1 border border-slate-200 text-center">Aksi</TableHead>
            </TableRow>
            <TableRow >
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">TR 4</TableHead>
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">TR 2</TableHead>
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">RT</TableHead>
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">Cornplanter</TableHead>
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">Cultivator</TableHead>
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">Hand Sprayer</TableHead>
              <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center">Pompa Air</TableHead>
            </TableRow>
            <TableRow >
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBN</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">TP</TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">APBD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataPSP?.data?.data && dataPSP.data.data.length > 0 ? (
              dataPSP?.data?.data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="border border-slate-200 text-center">
                    {(currentPage - 1) * limit + (index + 1)}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item?.tahun}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item?.kecamatan?.nama}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.tr_4_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.tr_4_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.tr_4_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.tr_2_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.tr_2_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.tr_2_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.rt_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.rt_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.rt_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.cornplanter_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.cornplanter_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.cornplanter_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.cultivator_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.cultivator_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.cultivator_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.hand_sprayer_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.hand_sprayer_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.hand_sprayer_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.pompa_air_apbn}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.pompa_air_tp}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.pompa_air_apbd}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    {item.keterangan}
                  </TableCell>
                  <TableCell className="border border-slate-200 text-center">
                    <div className="flex items-center gap-4">
                      <Link className='' href={`/psp/alsintan-prapanen/detail/${item.id}`}>
                        <EyeIcon />
                      </Link>
                      <Link className='' href={`/psp/alsintan-prapanen/edit/${item.id}`}>
                        <EditIcon />
                      </Link>
                      <DeletePopup onDelete={() => handleDelete(String(item.id || ''))} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={26} className="text-center">
                  <NotFoundSearch />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* table */}

      {/* pagination */}
      <div className="pagi flex items-center justify-end pb-5 lg:pb-0">
        {dataPSP?.data?.pagination?.totalCount as number > 1 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={dataPSP?.data.pagination.totalPages as number}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {/* pagination */}
    </div>
  )
}

export default Prapanen