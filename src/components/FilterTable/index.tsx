"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FilterIcon from "../../../public/icons/FilterIcon"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface FilterTableProps {
    columns: { label: string, key: string }[];
    defaultCheckedKeys: string[]; // Tambahkan props untuk kolom yang default dicentang
    onFilterChange: (key: string, checked: boolean) => void;
}

const FilterTable: React.FC<FilterTableProps> = ({ columns, defaultCheckedKeys, onFilterChange }) => {
    // Inisialisasi state dengan nilai defaultCheckedKeys
    const [checkedColumns, setCheckedColumns] = React.useState<{ [key: string]: boolean }>(
        columns.reduce((acc, column) => {
            acc[column.key] = defaultCheckedKeys.includes(column.key);
            return acc;
        }, {} as { [key: string]: boolean })
    );

    const handleCheckedChange = (key: string, checked: Checked) => {
        const isChecked = checked === true;
        setCheckedColumns(prev => ({
            ...prev,
            [key]: isChecked,
        }));
        onFilterChange(key, isChecked); // Kirim perubahan filter ke parent
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outlinePrimary" className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                    <FilterIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md">
                {/* <DropdownMenuLabel className="px-4 py-2 font-semibold">Filter Header Table</DropdownMenuLabel> */}
                <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                    Filter Kolom
                </DropdownMenuLabel>
                {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                <DropdownMenuSeparator className="my-2 border-gray-300" />
                {columns.map(column => (
                    <DropdownMenuCheckboxItem
                        key={column.key}
                        checked={checkedColumns[column.key]}
                        onCheckedChange={(checked) => handleCheckedChange(column.key, checked)}
                        className="px-6 py-2 rounded-md transition-colors duration-300"
                    >
                        {column.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FilterTable;
