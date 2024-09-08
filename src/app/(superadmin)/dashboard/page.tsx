"use client"

import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DashboardKetahananPangan from '@/components/dashboard/ketahanan-pangan';
import DashboardTanamanPanganHoltikultura from '@/components/dashboard/tanaman-pangan-holtikultura';
import DashboardPerkebunan from '@/components/dashboard/perkebunan';
import DashboardPenyuluhan from '@/components/dashboard/penyuluhan';
import DashboardPSP from '@/components/dashboard/psp';
import DashboardKepegawaian from '@/components/dashboard/kepegawaian';
import DashboardKorluh from '@/components/dashboard/korluh';
import DashboardKJFKabupaten from '@/components/dashboard/kjf-kabupaten';
import DashboardBPPKecamatan from '@/components/dashboard/bpp-kecamatan';

const Page = () => {
    const [selectedBidang, setSelectedBidang] = useState('Ketahanan Pangan'); // Default to 'Bidang 1'

    const handleSelectChange = (value: React.SetStateAction<string>) => {
        setSelectedBidang(value);
    };

    return (
        <div>
            {/* title */}
            {/* <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Dashboard</div> */}
            {/* title */}
            <div className="select w-full md:w-[40%] mt-3">
                <Select onValueChange={handleSelectChange} defaultValue={selectedBidang}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Bidang" className='text-2xl' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Ketahanan Pangan">Ketahanan Pangan</SelectItem>
                        <SelectItem value="Tanaman Pangan & Holtikultura">Tanaman Pangan & Holtikultura</SelectItem>
                        <SelectItem value="Perkebunan">Perkebunan</SelectItem>
                        <SelectItem value="Penyuluhan">Penyuluhan</SelectItem>
                        <SelectItem value="PSP">PSP</SelectItem>
                        <SelectItem value="Kepegawaian">Kepegawaian</SelectItem>
                        <SelectItem value="Korluh">Korluh</SelectItem>
                        <SelectItem value="BPP Kecamatan">BPP Kecamatan</SelectItem>
                        <SelectItem value="FJK Kabupaten">FJK Kabupaten</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="page mt-3">
                {selectedBidang === 'Ketahanan Pangan' && <div className="bidang1">
                    <DashboardKetahananPangan />
                </div>
                }
                {selectedBidang === 'Tanaman Pangan & Holtikultura' && <div className="bidang2">
                    <DashboardTanamanPanganHoltikultura />
                </div>
                }
                {selectedBidang === 'Perkebunan' && <div className="bidang3">
                    <DashboardPerkebunan />
                </div>
                }
                {selectedBidang === 'Penyuluhan' && <div className="bidang3">
                    <DashboardPenyuluhan />
                </div>
                }
                {selectedBidang === 'PSP' && <div className="bidang3">
                    <DashboardPSP />
                </div>
                }
                {selectedBidang === 'Kepegawaian' && <div className="bidang3">
                    <DashboardKepegawaian />
                </div>
                }
                {selectedBidang === 'Korluh' && <div className="bidang3">
                    <DashboardKorluh />
                </div>
                }
                {selectedBidang === 'BPP Kecamatan' && <div className="bidang3">
                    <DashboardBPPKecamatan />
                </div>
                }
                {selectedBidang === 'FJK Kabupaten' && <div className="bidang3">
                    <DashboardKJFKabupaten />
                </div>
                }
            </div>
        </div>
    );
};

export default Page;
