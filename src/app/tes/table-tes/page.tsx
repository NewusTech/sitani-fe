"use client"

import * as React from "react"
import FilterTable from "@/components/FilterTable"

// Contoh data kolom tabel
const columns = [
    { label: "Nama/NIP Tempat/Tgl Lahir", key: "namaNip" },
    { label: "Pangkat/Gol Ruang TMT Pangkat", key: "pangkat" },
    { label: "Jabatan", key: "jabatan" },
];

const defaultCheckedKeys = ["namaNip", "pangkat"]; // Kolom yang default dicentang

const exampleData = [
    { namaNip: "Andi / 12345", pangkat: "III/A", jabatan: "Staff" },
    { namaNip: "Budi / 67890", pangkat: "IV/B", jabatan: "Manager" },
    { namaNip: "Siti / 54321", pangkat: "II/C", jabatan: "Supervisor" },
];

const TableComponent = () => {
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(defaultCheckedKeys);

    const handleFilterChange = (key: string, checked: boolean) => {
        setVisibleColumns(prev =>
            checked ? [...prev, key] : prev.filter(col => col !== key)
        );
    };

    return (
        <div className="container mx-auto p-4">
            <FilterTable columns={columns} defaultCheckedKeys={defaultCheckedKeys} onFilterChange={handleFilterChange} />

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr>
                            {visibleColumns.includes("namaNip") && <th className="border px-4 py-2">Nama/NIP Tempat/Tgl Lahir</th>}
                            {visibleColumns.includes("pangkat") && <th className="border px-4 py-2">Pangkat/Gol Ruang TMT Pangkat</th>}
                            {visibleColumns.includes("jabatan") && <th className="border px-4 py-2">Jabatan</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {exampleData.map((row, index) => (
                            <tr key={index}>
                                {visibleColumns.includes("namaNip") && <td className="border px-4 py-2">{row.namaNip}</td>}
                                {visibleColumns.includes("pangkat") && <td className="border px-4 py-2">{row.pangkat}</td>}
                                {visibleColumns.includes("jabatan") && <td className="border px-4 py-2">{row.jabatan}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableComponent;
