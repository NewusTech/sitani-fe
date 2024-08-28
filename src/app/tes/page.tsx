"use client"

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

interface Data {
  nama: string;
  alamat: string;
  pendidikan: {
    sma: string;
    smp: string;
    sd: string;
  };
}

const Table: React.FC = () => {
  const filterOptions = ['Nama', 'Alamat', 'Pendidikan'];

  // Default all filter options are checked
  const [filter, setFilter] = useState<string[]>(filterOptions);

  const data: Data[] = [
    {
      nama: 'Andi',
      alamat: 'Jl. Merdeka No.1',
      pendidikan: { sma: 'SMA 1', smp: 'SMP 2', sd: 'SD 3' },
    },
    {
      nama: 'Budi',
      alamat: 'Jl. Kemerdekaan No.2',
      pendidikan: { sma: 'SMA 4', smp: 'SMP 5', sd: 'SD 6' },
    },
  ];

  // Filter data based on selected options
  const handleFilterChange = (option: string) => {
    let updatedFilter = [...filter];
    if (updatedFilter.includes(option)) {
      updatedFilter = updatedFilter.filter((item) => item !== option);
    } else {
      updatedFilter.push(option);
    }
    setFilter(updatedFilter);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const table = document.querySelector('table');
    if (table) {
      (doc as any).autoTable({ html: table });
      doc.save('table.pdf');
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = utils.json_to_sheet(
      data.map(item => ({
        Nama: filter.includes('Nama') ? item.nama : '',
        Alamat: filter.includes('Alamat') ? item.alamat : '',
        SMA: filter.includes('Pendidikan') ? item.pendidikan.sma : '',
        SMP: filter.includes('Pendidikan') ? item.pendidikan.smp : '',
        SD: filter.includes('Pendidikan') ? item.pendidikan.sd : '',
      }))
    );

    // Menambahkan header yang sesuai dengan tabel
    const header = [];
    if (filter.includes('Nama')) header.push('Nama');
    if (filter.includes('Alamat')) header.push('Alamat');
    if (filter.includes('Pendidikan')) {
      header.push('SMA');
      header.push('SMP');
      header.push('SD');
    }
    ws['!cols'] = header.map(col => ({ wch: col.length + 2 }));

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, 'table.xlsx');
  };

  // Print table
  const printTable = () => {
    const originalContent = document.body.innerHTML;
    const tableContent = document.querySelector('table')?.outerHTML || '';

    document.body.innerHTML = tableContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="flex flex-col items-center p-8">
      {/* Filter Options */}
      <div className="mb-4">
        {filterOptions.map((option) => (
          <label key={option} className="mr-2">
            <input
              type="checkbox"
              value={option}
              checked={filter.includes(option)}
              onChange={() => handleFilterChange(option)}
            />
            {option}
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="mb-4">
        <button onClick={exportToPDF} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Unduh PDF</button>
        <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Unduh Excel</button>
        <button onClick={printTable} className="bg-gray-500 text-white px-4 py-2 rounded">Cetak</button>
      </div>

      {/* Table */}
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {filter.includes('Nama') && <th className="border border-gray-300 p-2" rowSpan={2}>Nama</th>}
            {filter.includes('Alamat') && <th className="border border-gray-300 p-2" rowSpan={2}>Alamat</th>}
            {filter.includes('Pendidikan') && <th className="border border-gray-300 p-2" colSpan={3}>Pendidikan</th>}
          </tr>
          <tr>
            {filter.includes('Pendidikan') && (
              <>
                <th className="border border-gray-300 p-2">SMA</th>
                <th className="border border-gray-300 p-2">SMP</th>
                <th className="border border-gray-300 p-2">SD</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {filter.includes('Nama') && <td className="border border-gray-300 p-2">{item.nama}</td>}
              {filter.includes('Alamat') && <td className="border border-gray-300 p-2">{item.alamat}</td>}
              {filter.includes('Pendidikan') && (
                <>
                  <td className="border border-gray-300 p-2">{item.pendidikan.sma}</td>
                  <td className="border border-gray-300 p-2">{item.pendidikan.smp}</td>
                  <td className="border border-gray-300 p-2">{item.pendidikan.sd}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
