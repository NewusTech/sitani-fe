"use client"
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Page = () => {
    const [selectedBidang, setSelectedBidang] = useState('');

    const handleSelectChange = (value:any) => {
        setSelectedBidang(value);
    };

    return (
        <div>
            <div className="select">
                <Select onValueChange={handleSelectChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Bidang" className='text-2xl' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Bidang 1">Bidang 1</SelectItem>
                        <SelectItem value="Bidang 2">Bidang 2</SelectItem>
                        <SelectItem value="Bidang 3">Bidang 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="page">
                {selectedBidang === 'Bidang 1' && <div className="bidang1">Bidang 1 Content</div>}
                {selectedBidang === 'Bidang 2' && <div className="bidang2">Halaman Bidang 2</div>}
                {selectedBidang === 'Bidang 3' && <div className="bidang3">Halaman Bidang 3</div>}
            </div>
        </div>
    );
};

export default Page;
