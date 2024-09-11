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
                <Button variant="outlinePrimary" className="">
                    <FilterIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Header Table</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map(column => (
                    <DropdownMenuCheckboxItem
                        key={column.key}
                        checked={checkedColumns[column.key]}
                        onCheckedChange={(checked) => handleCheckedChange(column.key, checked)}
                    >
                        {column.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FilterTable;
