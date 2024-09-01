"use client";

import React from 'react'
import SearchIcon from '../../../../public/icons/SearchIcon'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
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
import EditIcon from '../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'

interface Data {
  tanggal?: string;
  judul?: string;
}

const KelolaBeritaPage = () => {
  const data: Data[] = [
    {
      tanggal: "20-07-2024",
      judul: "Bupati Dawam Umumkan Peresmian Mal Pelayanan Publik (MPP) Lampung Timur pada 2024",
    },
    {
      tanggal: "20-07-2024",
      judul: "Bupati Dawam Umumkan Peresmian Mal Pelayanan Publik (MPP) Lampung Timur pada 2024",
    },
  ];
  return (
    <div>
      {/* title */}
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Kelola Berita</div>
      {/* title */}
      {/* head */}
      <div className="header flex md:flex-row flex-col gap-2 justify-between items-center">
        <div className="search md:w-[50%] w-full">
          <Input
            type="text"
            placeholder="Cari"
            rightIcon={<SearchIcon />}
            className='border-primary py-2'
          />
        </div>
        <div className="right md:w-fit w-full flex justify-end md:mt-0 mt-2">
          <Link href="/kelola-berita/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
            Tambah Data
          </Link>
        </div>
      </div>
      {/* head */}
      {/* table */}
      <Table className='border border-slate-200 mt-4'>
        <TableHeader className='bg-primary-600'>
          <TableRow >
            <TableHead className="text-primary py-3">No</TableHead>
            <TableHead className="text-primary py-3">Tanggal</TableHead>
            <TableHead className="text-primary py-3">Judul</TableHead>
            <TableHead className="text-primary py-3">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {index + 1}
              </TableCell>
              <TableCell>
                {item.tanggal}
              </TableCell>
              <TableCell>
                {item.judul}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Link className='' href="/kepegawaian/data-pegawai/edit-pegawai">
                    <EditIcon />
                  </Link>
                  <DeletePopup onDelete={() => { }} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* table */}
    </div>
  )
}

export default KelolaBeritaPage