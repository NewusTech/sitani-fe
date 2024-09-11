"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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
import EyeIcon from '../../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'
import Swal from 'sweetalert2'
import useSWR, { mutate, SWRResponse } from 'swr'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import PaginationTable from '@/components/PaginationTable'

interface Komoditas {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

interface ListItem {
  id: number;
  kepangProdusenEceranId: number;
  kepangMasterKomoditasId: number;
  satuan: string | null;
  harga: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
  komoditas: Komoditas;
}

interface DataItem {
  id: number;
  tanggal: string;
  createdAt: string;
  updatedAt: string;
  list: ListItem[];
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
    data: DataItem[];
    pagination: Pagination;
  };
}

const ProdusenDanEceran = () => {
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
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

  const { data: dataProdusenEceran }: SWRResponse<Response> = useSWR(
    `/kepang/produsen-eceran/get?page=${currentPage}&search=${search}`,
    (url) =>
      axiosPrivate
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => res.data)
  );

  console.log(dataProdusenEceran)

  const handleDelete = async (id: string) => {
    try {
      await axiosPrivate.delete(`/kepang/produsen-eceran/delete/${id}`, {
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
      mutate('/kepang/produsen-eceran/get');
    } catch (error) {
      console.error('Failed to delete:', error);
      console.log(id)
      // Add notification or alert here for user feedback
    }
  };

  let num = 1;

  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase" > Daftar Harga Produsen dan Eceran</div>
      {/* title */}
      {/* top */}
      <div className="header flex gap-2 justify-between items-center mt-4">
        <div className="search md:w-[50%]">
          <Input
            autoFocus
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
      <div className="wrap-filter flex justify-between items-center mt-2 md:mt-4 " >
        <div className="left gap-2 flex justify-start items-center">
          <div className="filter-table w-[40px] h-[40px]">
            <Button variant="outlinePrimary" className=''>
              <FilterIcon />
            </Button>
          </div>
        </div>
        <div className="right transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
          <Link href="/ketahanan-pangan/produsen-dan-eceran/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
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
            <TableHead className="text-primary py-3">Tanggal</TableHead>
            <TableHead className="text-primary py-3">Komoditas</TableHead>
            <TableHead className="text-primary py-3">Satuan</TableHead>
            <TableHead className="text-primary py-3">Harga Komoditas</TableHead>
            <TableHead className="text-primary py-3">Keterangan</TableHead>
            <TableHead className="text-primary py-3 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataProdusenEceran?.data?.data && dataProdusenEceran?.data?.data.length > 0 ? (
            dataProdusenEceran.data.data.map((item, index) => (
              item?.list?.map((citem, cindex) => (
                <TableRow key={citem.id}>
                  <TableCell>
                    {num++}
                  </TableCell>
                  <TableCell>
                    {/* {item.tanggal} */}
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }) : 'Tanggal tidak tersedia'}
                  </TableCell>
                  <TableCell>
                    {citem?.komoditas.nama}
                  </TableCell>
                  <TableCell>
                    {citem?.satuan}
                  </TableCell>
                  <TableCell>
                    Rp. {citem?.harga}
                  </TableCell>
                  <TableCell>
                    {citem?.keterangan} {/* Menampilkan keterangan dari item pertama dalam list */}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Link href={`/ketahanan-pangan/produsen-dan-eceran/detail/${citem?.id}`}>
                        <EyeIcon />
                      </Link>
                      <Link href={`/ketahanan-pangan/produsen-dan-eceran/edit/${citem?.id}`}>
                        <EditIcon />
                      </Link>
                      <DeletePopup onDelete={() => handleDelete(String(citem?.id))} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
      {/* table */}

      {/* pagination */}
      <div className="pagi flex items-center lg:justify-end justify-center">
        {dataProdusenEceran?.data.pagination.totalCount as number > 1 && (
          <PaginationTable
            currentPage={currentPage}
            totalPages={dataProdusenEceran?.data.pagination.totalPages as number}
            onPageChange={onPageChange}
          />
        )}
      </div>
      {/* pagination */}
    </div >
  )
}

export default ProdusenDanEceran