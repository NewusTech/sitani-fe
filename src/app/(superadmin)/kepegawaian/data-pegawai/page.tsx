"use client"

import { Input } from '@/components/ui/input'
import React from 'react'
import { Button } from '@/components/ui/button'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'

interface Data {
  nama?: string;
  nip?: string;
  tempat?: string;
  tanggalLahir?: string;
  pangkatGol?: string;
  tmtPangkat?: string;
  jabatan?: string;
  tmtJabatan?: string;
  diklatStruktural?: {
    nama?: string;
    tanggal?: string;
    jam?: string;
  };
  pendidikanUmum: {
    nama: string;
    tahunLulus: string;
    jenjang: string;
  };
  usia?: number;
  masaKerja?: string;
  keterangan?: string;
}


const DataPegawaiPage = () => {

  const data: Data[] = [
    {
      nama: "John Doe",
      nip: "123456789",
      tempat: "Jakarta",
      tanggalLahir: "1990-01-01",
      pangkatGol: "Pembina Utama IV/a",
      tmtPangkat: "2022-01-01",
      jabatan: "Manager",
      tmtJabatan: "2023-01-01",
      diklatStruktural: {
        nama: "Diklat Kepemimpinan",
        tanggal: "2021-01-01",
        jam: "40 Jam",
      },
      pendidikanUmum: {
        nama: "Universitas XYZ",
        tahunLulus: "2012",
        jenjang: "S1",
      },
      usia: 34,
      masaKerja: "12 Tahun",
      keterangan: "Aktif",
    },
    {
      nama: "Jane Smith",
      nip: "987654321",
      tempat: "Bandung",
      tanggalLahir: "1988-02-02",
      pangkatGol: "Pembina Utama IV/a",
      tmtPangkat: "2021-02-02",
      jabatan: "Staff",
      tmtJabatan: "2022-02-02",
      diklatStruktural: {
        nama: "Diklat Manajemen",
        tanggal: "2020-02-02",
        jam: "30 Jam",
      },
      pendidikanUmum: {
        nama: "Universitas ABC",
        tahunLulus: "2010",
        jenjang: "S2",
      },
      usia: 36,
      masaKerja: "14 Tahun",
      keterangan: "Aktif",
    },
  ];

  const handleSubmit = () => {
    console.log(data);
  };


  return (
    <div title='Kepegawaian' className=''>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Kepegawaian</div>
      {/* title */}
      <div className="header flex justify-between items-center">
        <div className="search w-[50%]">
          <Input
            type="text"
            placeholder="Cari"
            rightIcon={<SearchIcon />}
            className='border-primary py-2'
          />
        </div>
        <div className="btn flex gap-3">
          <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
            <UnduhIcon />
            Download
          </Button>
          <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
            <PrintIcon />
            Print
          </Button>
        </div>
      </div>
      <div className="date mt-3 gap-2 flex justify-start items-center">
        <div className="">
          <Input
            type='date'
            className='w-fit py-2'
          />
        </div>
        <div className="">to</div>
        <div className="">
          <Input
            type='date'
            className='w-fit py-2'
          />
        </div>
        <div className="w-[40px] h-[40px]">
          <Button variant="outlinePrimary" className=''>
            <FilterIcon />
          </Button>
        </div>
      </div>
      {/* table */}
      <div className="wrap-table w-full overflow-auto mt-4">
        <table className="table-auto border-collapse border border-primary mb-4 rounded">
          <thead className="bg-primary-600 text-primary">
            <tr>
              <th className="border border-primary p-2" rowSpan={2}>Nama/NIP/Tempat/Tgl Lahir</th>
              <th className="border border-primary p-2" rowSpan={2}>Pangkat/Gol Ruang/TMT pangkat</th>
              <th className="border border-primary p-2" rowSpan={2}>Jabatan/TMT Jabatan</th>
              <th className="border border-primary p-2" colSpan={3}>Diklat Struktural</th>
              <th className="border border-primary p-2" colSpan={3}>Pendidikan Umum</th>
              <th className="border border-primary p-2" rowSpan={2}>Usia</th>
              <th className="border border-primary p-2" rowSpan={2}>Masa Kerja</th>
              <th className="border border-primary p-2" rowSpan={2}>Ket</th>
            </tr>
            <tr>
              <th className="border border-primary p-2">Nama Diklat</th>
              <th className="border border-primary p-2">Tanggal</th>
              <th className="border border-primary p-2">Jam</th>
              <th className="border border-primary p-2">Nama</th>
              <th className="border border-primary p-2">Tahun Lulus</th>
              <th className="border border-primary p-2">Jenjang</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border border-primary p-2">
                  {item.nama}
                  <br />
                  NIP: {item.nip}
                  <br />
                  {item.tempat},{item.tanggalLahir}
                </td>
                <td className="border border-primary p-2">
                  {item.pangkatGol}
                  <br />
                  TMT: {item.tmtPangkat}
                </td>
                <td className="border border-primary p-2">
                  {item.jabatan}
                  <br />
                  TMT: {item.tmtJabatan}
                </td>
                <td className="border border-primary p-2">{item.diklatStruktural?.nama}</td>
                <td className="border border-primary p-2">{item.diklatStruktural?.tanggal}</td>
                <td className="border border-primary p-2">{item.diklatStruktural?.jam}</td>
                <td className="border border-primary p-2">{item.pendidikanUmum.nama}</td>
                <td className="border border-primary p-2">{item.pendidikanUmum.jenjang}</td>
                <td className="border border-primary p-2">{item.pendidikanUmum.tahunLulus}</td>
                <td className="border border-primary p-2">{item.usia}</td>
                <td className="border border-primary p-2">{item.masaKerja}</td>
                <td className="border border-primary p-2">{item.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit Data
      </button>
      {/* table */}
    </div>
  )
}

export default DataPegawaiPage