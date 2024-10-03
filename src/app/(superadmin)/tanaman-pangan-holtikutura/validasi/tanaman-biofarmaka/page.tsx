"use client";

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../../public/icons/FilterIcon'
import Link from 'next/link'
import EditIcon from '../../../../../../public/icons/EditIcon'
import EyeIcon from '../../../../../../public/icons/EyeIcon'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { format } from "date-fns"
import { Calendar as CalendarIcon, Filter } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Swal from 'sweetalert2';
import KecamatanSelect from '@/components/superadmin/SelectComponent/SelectKecamatan';
import PaginationTable from '@/components/PaginationTable';
import VerifikasiPopup from '@/components/superadmin/PopupVerifikasi';
import TolakPopup from '@/components/superadmin/TolakVerifikasi';
import KecamatanSelectNo from '@/components/superadmin/SelectComponent/SelectKecamatanNo';
import VerifikasiKab from '@/components/superadmin/VerifikasiKab';
import TolakTPH from '@/components/superadmin/TolakKab';
import TambahIcon from '../../../../../../public/icons/TambahIcon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Label from '@/components/ui/label';
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun';

const ValidasiTanamanBiofarmaka = () => {
  // INTEGRASI
  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();
  // State untuk menyimpan id kecamatan yang dipilih
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("12");

  function getPreviousMonth(): number {
    const now = new Date();
    let month = now.getMonth(); // 0 = January, 11 = December

    if (month === 0) {
      // Jika bulan adalah Januari (0), set bulan ke Desember (11)
      month = 11;
    } else {
      month -= 1;
    }

    return month + 1; // +1 untuk menyesuaikan hasil ke format 1 = Januari
  }

  const previousMonth = getPreviousMonth();

  // filter tahun bulan
  const currentYear = new Date().getFullYear();
  const [tahun, setTahun] = React.useState(`${currentYear}`);
  const [triwulan, setTriwulan] = React.useState(`1`);
  // filter tahun bulan

  // GETALL
  const { data: dataBiofarmaka }: SWRResponse<any> = useSWR(
    // `korluh/padi/get?limit=1`,
    `/validasi/korluh-tanaman-biofarmaka/data?kecamatan=${selectedKecamatan}&tahun=${tahun}&triwulan=${triwulan}`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  // Bulan
  function getMonthName(monthNumber: number): string {
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Kurangi 1 dari monthNumber karena array dimulai dari indeks 0
    return monthNames[monthNumber - 1] || "Invalid Month";
  }
  const monthNumber = dataBiofarmaka?.data?.bulan; // Ambil bulan dari data API
  const monthName = monthNumber ? getMonthName(monthNumber) : "";
  // Bulan

  // handle tolak
  // Fungsi untuk mengirim data ke API
  const handleTolak = async (payload: { kecamatan_id: number; triwulan: string; tahun: string; status: string; keterangan: string; }) => {
    try {
      await axiosPrivate.post("/validasi/korluh-tanaman-biofarmaka/set", payload);
      // alert
      Swal.fire({
        icon: 'success',
        title: 'Data berhasil ditolak!',
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
      console.log(payload)
      // push
      console.log("Success to validasi Padi:");
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menolak data!';
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
    } finally {
      // setLoading(false); // Set loading to false once the process is complete
    }
    mutate(`/validasi/korluh-tanaman-biofarmaka/data?kecamatan=${selectedKecamatan}&tahun=${tahun}&triwulan=${triwulan}`);
  };

  // Fungsi untuk mengirim data ke API
  const handleVerifikasi = async (payload: { kecamatan_id: number; triwulan: string; tahun: string; status: string }) => {
    try {
      await axiosPrivate.post("/validasi/korluh-tanaman-biofarmaka/set", payload);
      // alert
      Swal.fire({
        icon: 'success',
        title: 'Data berhasil divalidasi!',
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
      console.log(payload)
      // push
      console.log("Success to validasi Padi:");
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memvalidasi data!';
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
    } finally {
      // setLoading(false); // Set loading to false once the process is complete
    }
    mutate(`/validasi/korluh-tanaman-biofarmaka/data?kecamatan=${selectedKecamatan}&tahun=${tahun}&triwulan=${triwulan}`);
  };

  // validasi
  const getValidationText = (validasi: any) => {
    switch (validasi) {
      case 'terima':
        return 'Sudah divalidasi';
      case 'tolak':
        return 'Validasi ditolak, menunggu revisi';
      case 'tunggu':
        return 'Sudah direvisi, menunggu divalidasi';
      case 'belum':
        return 'Belum divalidasi';
      default:
        return 'Status tidak diketahui';
    }
  };
  const validationText = getValidationText(dataBiofarmaka?.data?.status);
  // validasi

  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Validasi Tanaman Biofarmaka</div>
      {/* title */}

      {/* desktop */}
      <div className="hidden md:block">
        {/* top */}
        <div className="header flex gap-2 justify-end items-center mt-4">
          <div className="btn flex gap-2">
            {/* <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Print
                        </div>
                    </Button> */}
          </div>
        </div>
        {/* top */}
        {/*  */}
        <div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
          <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
            <div className="w-[80px]">
              <TahunSelect
                url='korluh/master-tahun/tanaman-biofarmaka'
                // semua={true}
                value={tahun}
                onChange={(value) => {
                  setTahun(value);
                }}
              />
            </div>
            <div className="">-</div>
            <div className="w-[200px]">
              <Select
                onValueChange={(value) => setTriwulan(value)}
                value={triwulan}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Triwulan" className='text-2xl' />
                </SelectTrigger>
                <SelectContent>
                  <div className="text-primary font-semibold text-center">Pilih Triwulan</div>
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                  <SelectItem value="1">Januari - Maret</SelectItem>
                  <SelectItem value="2">April - Juni</SelectItem>
                  <SelectItem value="3">Juli - September</SelectItem>
                  <SelectItem value="4">Oktober - Desember</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[230px]">
              <KecamatanSelectNo
                value={selectedKecamatan}
                onChange={(value) => {
                  setSelectedKecamatan(value);
                }}
              />
            </div>
          </div>
          <div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
            <Link href={`/tanaman-pangan-holtikutura/validasi/tanaman-biofarmaka/detail/${selectedKecamatan}/${tahun}/${triwulan}`} className='bg-blue-500 px-3 py-3 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
              Detail
            </Link>
            <Link href="/tanaman-pangan-holtikutura/validasi/tanaman-biofarmaka/tambah" className='bg-primary px-3 py-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm w-[150px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
              Tambah Data
            </Link>
          </div>
        </div>
        {/* top */}
        {/* keterangan */}
        <div className="keterangan flex gap-2 mt-2">
          <div className="nama font-semibold">
            <div className="">
              Kecamatan
            </div>
            <div className="">
              Tanggal
            </div>
            <div className="">
              Status
            </div>
            <div className="">
              Validasi
            </div>
            <div className="">
              Keterangan
            </div>
          </div>
          <div className="font-semibold">
            <div className="">:</div>
            <div className="">:</div>
            <div className="">:</div>
            <div className="">:</div>
            <div className="">:</div>
          </div>
          <div className="bulan">
            <div className="">{dataBiofarmaka?.data?.kecamatan ?? "-"}</div>
            <div className="">{monthName ?? "-"} {dataBiofarmaka?.data?.tahun ?? "-"}</div>
            <div className="capitalize">{validationText ?? "-"}</div>
            <div className="flex gap-3">
              <VerifikasiKab
                kecamatanId={dataBiofarmaka?.data?.kecamatanId}
                triwulan={dataBiofarmaka?.data?.triwulan}
                tahun={dataBiofarmaka?.data?.tahun}
                onVerifikasi={handleVerifikasi}
              />
              <TolakTPH
                kecamatanId={dataBiofarmaka?.data?.kecamatanId}
                triwulan={dataBiofarmaka?.data?.triwulan}
                tahun={dataBiofarmaka?.data?.tahun}
                onTolak={handleTolak}
              />
            </div>
            <div className="w-[300px] max-w-[300px] text-justify">{dataBiofarmaka?.data?.keterangan ?? "-"}</div>
          </div>
        </div>
      </div>
      {/* desktop */}

      {/* Mobile */}
      <div className="md:hidden">
        <>
          {/* Handle filter menu*/}
          <div className="flex justify-between w-full mt-4">
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
                      <Label className='text-xs mb-1 !text-black opacity-50' label="Pilih Kecamatan" />
                      <div className="w-full mb-2">
                        <KecamatanSelectNo
                          value={selectedKecamatan}
                          onChange={(value) => {
                            setSelectedKecamatan(value);
                          }}
                        />
                      </div>
                      {/* Filter Kecamatan */}

                      {/* Filter Tahun Bulan */}
                      <>
                        <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Triwulan" />
                        <div className="flex gap-2 justify-between items-center w-full">
                          {/* filter tahun */}
                          <TahunSelect
                            url='korluh/master-tahun/tanaman-biofarmaka'
                            // semua={true}
                            value={tahun}
                            onChange={(value) => {
                              setTahun(value);
                            }}
                          />
                          -
                          {/* filter tahun */}
                          {/* Filter bulan */}
                          <div className="w-full">
                            <Select
                              onValueChange={(value) => setTriwulan(value)}
                              value={triwulan}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Triwulan" className='text-2xl' />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="text-primary font-semibold text-center">Pilih Triwulan</div>
                                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                <SelectItem value="1">Januari - Maret</SelectItem>
                                <SelectItem value="2">April - Juni</SelectItem>
                                <SelectItem value="3">Juli - September</SelectItem>
                                <SelectItem value="4">Oktober - Desember</SelectItem>
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

              {/* unduh print */}
              {/* <TPHPalawija1
                                urlApi={`/tph/realisasi-palawija-1/get?bulan=${selectedTahun}/${bulan}&kecamatan=${selectedKecamatan}`}
                                kecamatan={selectedKecamatan}
                                tahun={selectedTahun}
                                bulan={bulan}
                            /> */}
              {/* unduh print */}
            </div>

            {/* Tambah Data */}
            <div className="flex justify-end items-center w-fit gap-2">
              <Link href={`/tanaman-pangan-holtikutura/validasi/tanaman-biofarmaka/detail/${selectedKecamatan}/${tahun}/${triwulan}`} className='bg-blue-500 px-4 py-2 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 cursor-pointer'>
                Detail
              </Link>
              <Link
                href="/tanaman-pangan-holtikutura/validasi/tanaman-biofarmaka/tambah"
                className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
                {/* Tambah */}
                <TambahIcon />
              </Link>
            </div>
            {/* Tambah Data */}
          </div>

        </>
        <div className="card-table text-xs p-3 rounded-2xl border border-primary bg-white shadow-sm mt-4">
          {/* keterangan */}
          <div className="keterangan flex gap-2">
            <div className="nama font-semibold">
              <div className="">
                Kecamatan
              </div>
              <div className="">
                Tanggal
              </div>
              <div className="">
                Status
              </div>
              <div className="">
                Validasi
              </div>
              <div className="mt-1">
                Keterangan
              </div>
            </div>
            <div className="font-semibold">
              <div className="">:</div>
              <div className="">:</div>
              <div className="">:</div>
              <div className="">:</div>
              <div className="mt-1">:</div>
            </div>
            <div className="bulan">
              <div className="">{dataBiofarmaka?.data?.kecamatan ?? "-"}</div>
              <div className="">{monthName ?? "-"} {dataBiofarmaka?.data?.tahun ?? "-"}</div>
              <div className="capitalize">{validationText ?? "-"}</div>
              <div className="flex gap-3">
                <VerifikasiKab
                  kecamatanId={dataBiofarmaka?.data?.kecamatanId}
                  triwulan={dataBiofarmaka?.data?.triwulan}
                  tahun={dataBiofarmaka?.data?.tahun}
                  onVerifikasi={handleVerifikasi}
                />
                <TolakTPH
                  kecamatanId={dataBiofarmaka?.data?.kecamatanId}
                  triwulan={dataBiofarmaka?.data?.triwulan}
                  tahun={dataBiofarmaka?.data?.tahun}
                  onTolak={handleTolak}
                />
              </div>
              <div className=" text-justify">{dataBiofarmaka?.data?.keterangan ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile */}

      {/* mobile table */}
      <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
        <div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
          <div className="wrap-konten flex flex-col gap-2">
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  {/* Jahe */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">1.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jahe</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[1]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[1]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[1]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[1]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[1]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[1]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[1]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[1]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[1]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[1]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Jeruk Nipis */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">2.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jeruk Nipis</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[2]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[2]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[2]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[2]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[2]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[2]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[2]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[2]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[2]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[2]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Kepulaga */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">3.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kapulaga</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[3]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[3]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[3]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[3]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[3]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[3]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[3]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[3]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[3]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[3]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Kencur */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">4.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kencur</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[4]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[4]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[4]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[4]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[4]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[4]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[4]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[4]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[4]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[4]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Kunyit */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">5.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Kunyit</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[5]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[5]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[5]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[5]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[5]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[5]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[5]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[5]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[5]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[5]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Laos/Lengkuas */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">6.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Laos/Lengkuas</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[6]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[6]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[6]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[6]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[6]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[6]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[6]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[6]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[6]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[6]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Lempuyang */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">7.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Jeruk Nipis</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[7]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[7]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[7]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[7]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[7]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[7]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[7]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[7]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[7]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[7]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Lidah Buaya */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">8.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Lidah Buaya</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[8]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[8]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[8]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[8]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[8]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[8]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[8]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[8]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[8]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[8]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Mahkota Dewa */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">9.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mahkota Dewa</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[9]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[9]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[9]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[9]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[9]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[9]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[9]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[9]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[9]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[9]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Mengkudu/Pace */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">10.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Mengkudu/Pace</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[10]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[10]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[10]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[10]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[10]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[10]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[10]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[10]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[10]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[10]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Sambiloto */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">11.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Sambiloto</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[11]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[11]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[11]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[11]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[11]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[11]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[11]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[11]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[11]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[11]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Serai */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">12.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Serai</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[12]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[12]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[12]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[12]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[12]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[12]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[12]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[12]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[12]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[12]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Temuireng */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">13.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Temuireng</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[13]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[13]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[13]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[13]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[13]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[13]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[13]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[13]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[13]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[13]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>

                  {/* Temukunci */}
                  <>
                    <div className="flex justify-between gap-5">
                      <div className="label font-medium text-black">14.</div>
                      <div className="konten text-black/80 text-end"></div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem className='' value="item-1">
                        <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Temukunci</AccordionTrigger>
                        <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Yang Lalu (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[14]?.bulanLalu ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Luas Panen (m2)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pl-2 pr-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[14]?.luasPanenHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[14]?.luasPanenBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Rusak / Tidak Berhasil / Puso (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[14]?.luasRusak ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Penanaman Baru / Tambah Tanam  (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[14]?.luasPenanamanBaru ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Luas Tanaman Akhir Triwulan Laporan (m2)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[14]?.akhir ?? "-"}
                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2" />
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem className='' value="item-1">
                              <AccordionTrigger className='hover:pl-0 text-black pl-0 pr-0 pt-2 pb-2'>Produksi (Kilogram)</AccordionTrigger>
                              <AccordionContent className='text-xs md:text-sm mb-2 pr-2 pl-2'>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Dipanen Habis / Dibongkar</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[14]?.produksiHabis ?? "-"}
                                  </div>
                                </div>
                                <div className="flex justify-between gap-5">
                                  <div className="label font-medium text-black">Belum Habis</div>
                                  <div className="konten text-black/80 text-end">
                                    {dataBiofarmaka?.data[14]?.produksiBelumHabis ?? "-"}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[14]?.rerataHarga ?? "-"}

                            </div>
                          </div>
                          <hr className="border border-primary-600 transition-all ease-in-out animate-pulse mt-2 mb-2" />
                          <div className="flex justify-between gap-5">
                            <div className="label font-medium text-black">Keterangan</div>
                            <div className="konten text-black/80 text-end">
                              {dataBiofarmaka?.data[14]?.keterangan ?? "-"}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <hr className="border border-primary transition-all ease-in-out animate-pulse mb-2" />
                  </>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        {/* Umbi lainnya */}
      </div >
      {/* mobile table */}

      {/* table */}
      <div className="hidden md:block">
        <Table className='border border-slate-200 mt-4'>
          <TableHeader className='bg-primary-600'>
            <TableRow >
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                No
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                <div className="text-center items-center">
                  Nama Tanaman
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                <div className="w-[150px] text-center items-center">
                  Luas Tanaman Akhir Triwulan Yang Lalu (m2)
                </div>
              </TableHead>
              <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                <div className="text-center items-center">
                  Luas Panen (m2)
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                <div className="w-[150px] text-center items-center">
                  Luas Rusak / Tidak Berhasil / Puso (m2)
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                <div className="w-[150px] text-center items-center">
                  Luas Penanaman Baru / Tambah Tanam (m2)
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                <div className="w-[150px] text-center items-center">
                  Luas Tanaman Akhir Triwulan Laporan (m2)  (3)-(4)-(6)+(7)
                </div>
              </TableHead>
              <TableHead colSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                Produksi (Kilogram)
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                <div className="w-[150px] text-center items-center">
                  Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)
                </div>
              </TableHead>
              <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200">
                Keterangan
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">
                Habis / <br /> Dibongkar
              </TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">
                Belum Habis
              </TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">
                Dipanen Habis / Dibongkar
              </TableHead>
              <TableHead className="text-primary py-1 border border-slate-200 text-center">
                Belum Habis
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Jahe */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                1.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Jahe
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[1]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Jeruk Nipis */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                2.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Jeruk Nipis
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[2]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Kapulaga */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                3.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Kepulaga
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[3]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Kencur */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                4.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Kencur
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[4]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Kunyit */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                5.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Kunyit
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[5]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Laos/Lengkuas */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                6.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Laos/Lengkuas
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[6]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Lempuyang */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                7.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Lempuyang
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[7]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Lidah Buaya */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                8.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Lidah Buaya
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[8]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Mahkota Dewa */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                9.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Mahkota Dewa
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[9]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Mengkudu/Pace */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                10.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Mengkudu/Pace
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[10]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Sambiloto */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                11.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Sambiloto
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[11]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Serai */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                12.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Serai
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[12]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Temuireng */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                13.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Temuireng
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[13]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Temukunci */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                14.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Temukunci
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.rerataHarga && dataBiofarmaka?.data[14]?.count
                  ? Number.isInteger(dataBiofarmaka?.data[14]?.rerataHarga / dataBiofarmaka?.data[14]?.count)
                    ? (dataBiofarmaka?.data[14]?.rerataHarga / dataBiofarmaka?.data[14]?.count).toLocaleString()
                    : (dataBiofarmaka?.data[14]?.rerataHarga / dataBiofarmaka?.data[14]?.count).toFixed(2)
                  : '-'}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[14]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
            {/* Temulawak */}
            <TableRow >
              <TableCell className='border border-slate-200 text-center'>
                15.
              </TableCell>
              <TableCell className='border border-slate-200'>
                Temulawak
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.bulanLalu ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.luasPanenHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.luasPanenBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.luasRusak ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.luasPenanamanBaru ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.akhir ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.produksiHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.produksiBelumHabis ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.rerataHarga ?? "-"}
              </TableCell>
              <TableCell className='border border-slate-200 text-center'>
                {dataBiofarmaka?.data[15]?.keterangan ?? "-"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {/* table */}
    </div>
  )
}

export default ValidasiTanamanBiofarmaka