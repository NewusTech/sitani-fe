"use client";
import React from "react";

interface Data {
  nama?: string;
  nip?: string;
  tempat?: string;
  tanggalLahir?: string;
  pangkat?: string;
  golongan?: string;
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

const Table: React.FC = () => {
  const data: Data[] = [
    {
      nama: "John Doe",
      nip: "123456789",
      tempat: "Jakarta",
      tanggalLahir: "1990-01-01",
      pangkat: "IV/a",
      golongan: "Pembina",
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
      pangkat: "III/c",
      golongan: "Penata",
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
    <div className="flex flex-col items-center p-8">
      <table className="table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Nama/NIP/Tempat/Tgl Lahir</th>
            <th className="border border-gray-300 p-2">Pangkat/Gol Ruang TMT pangkat</th>
            <th className="border border-gray-300 p-2">Jabatan/TMT Jabatan</th>
            <th className="border border-gray-300 p-2">TMT Jabatan</th>
            <th className="border border-gray-300 p-2">Diklat Struktural</th>
            <th className="border border-gray-300 p-2">Pendidikan Umum</th>
            <th className="border border-gray-300 p-2">Usia</th>
            <th className="border border-gray-300 p-2">Masa Kerja</th>
            <th className="border border-gray-300 p-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.nama}</td>
              <td className="border border-gray-300 p-2">{item.nip}</td>
              <td className="border border-gray-300 p-2">{item.tempat}</td>
              <td className="border border-gray-300 p-2">{item.tanggalLahir}</td>
              <td className="border border-gray-300 p-2">{item.pangkat}</td>
              <td className="border border-gray-300 p-2">{item.golongan}</td>
              <td className="border border-gray-300 p-2">{item.tmtPangkat}</td>
              <td className="border border-gray-300 p-2">{item.jabatan}</td>
              <td className="border border-gray-300 p-2">{item.tmtJabatan}</td>
              <td className="border border-gray-300 p-2">{item.diklatStruktural?.nama}</td>
              <td className="border border-gray-300 p-2">{item.diklatStruktural?.tanggal}</td>
              <td className="border border-gray-300 p-2">{item.diklatStruktural?.jam}</td>
              <td className="border border-gray-300 p-2">{item.pendidikanUmum.nama}</td>
              <td className="border border-gray-300 p-2">{item.pendidikanUmum.jenjang}</td>
              <td className="border border-gray-300 p-2">{item.pendidikanUmum.tahunLulus}</td>
              <td className="border border-gray-300 p-2">{item.usia}</td>
              <td className="border border-gray-300 p-2">{item.masaKerja}</td>
              <td className="border border-gray-300 p-2">{item.keterangan}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit Data
      </button>
    </div>
  );
};

export default Table;
