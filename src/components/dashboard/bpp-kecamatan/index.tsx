import Link from 'next/link';
import React, { useState } from 'react';
import HeaderDash from '@/components/HeaderDash';
import DashCard from '@/components/DashCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useSWR, { SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue'; // Assuming you have this component

const DashboardBPPKecamatan = () => {
    interface DashboardDataResponse {
        status: number;
        message: string;
        data: {
            padiPanenCount: number;
            padiTanamCount: number;
            padiPusoCount: number;
            korluhTanamanBiofarmaka: {
                luas: number;
                namaTanaman: string;
                harga: number;
            }[];
            korluhTanamanHias: {
                luas: number;
                namaTanaman: string;
                harga: number;
            }[];
            korluhSayurBuah: {
                luas: number;
                hasilProduksi: string;
                namaTanaman: string;
            }[];
            korluhPalawija: {
                panen: number;
                tanam: number;
                puso: number;
                nama: string;
            }[];
        };
    }

    // State for filters
    const [selectedFilter, setSelectedFilter] = useState<string>('year');
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedKecamatan, setSelectedKecamatan] = useState<number | undefined>(undefined);

    const handleKecamatanChange = (value: number) => {
        setSelectedKecamatan(value);
        setSelectedDesa(0);
    };
    

    const [selectedDesa, setSelectedDesa] = useState<number | undefined>(undefined);


    // Handle filter changes
    const handleFilterClick = (filter: string) => setSelectedFilter(filter);
    const handleYearChange = (value: string) => {
        setSelectedYear(value)
        setSelectedMonth(null)
    };
    const handleMonthChange = (value: string) => setSelectedMonth(value);
    const handleDesaChange = (value: number) => {
        setSelectedDesa(value);
    };
    

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    // Construct the API URL with dynamic filters
    const apiUrl = `/korluh/dashboard/get?limit=10${selectedKecamatan ? `&kecamatan=${selectedKecamatan}` : ''
        }${selectedDesa ? `&desa=${selectedDesa}` : ''}${selectedYear !== null && selectedYear !== '0' ? `&year=${selectedYear}` : ''
        }${selectedMonth !== null && selectedMonth !== '0' ? `&month=${selectedMonth}` : ''}`;

    // SWR fetch data with dynamic API URL
    const { data: dataKorluh }: SWRResponse<DashboardDataResponse> = useSWR(
        apiUrl,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    // if (!dataKorluh) return <div>Loading...</div>;

    const {
        padiPanenCount,
        padiTanamCount,
        padiPusoCount,
        korluhPalawija,
        korluhSayurBuah,
        korluhTanamanHias,
        korluhTanamanBiofarmaka,
    } = dataKorluh?.data || {};

    return (
        <div className=''>
            {/* title */}
            <div className="text-xl md:text-2xl mb-4 font-semibold text-primary uppercase">Dashboard BPP Kecamatan</div>
            <div className="wrap flex flex-col gap-3 md:flex-row justify-between">
                <div className="w-full flex gap-3">
                    <div className="kecamatan">
                        <KecValue
                            value={selectedKecamatan}
                            onChange={handleKecamatanChange}
                        />
                    </div>
                    <div className="desa">
                        <DesaValue
                            value={selectedDesa}
                            onChange={handleDesaChange}
                            kecamatanValue={selectedKecamatan}
                        />
                    </div>
                </div>
                {/* filter */}
                <div className="wrap items-center mb-5 flex gap-3">
                    <div className="text-lg flex gap-4">
                        <button
                            className={`${selectedFilter === 'year' ? 'aktif text-primary font-semibold' : 'text-black/70'
                                }`}
                            onClick={() => handleFilterClick('year')}
                        >
                            Tahun
                        </button>
                        <button
                            className={`${selectedFilter === 'month' ? 'aktif text-primary font-semibold' : 'text-black/70'
                                }`}
                            onClick={() => handleFilterClick('month')}
                        >
                            Bulan
                        </button>
                    </div>

                    {selectedFilter === 'year' && (
                        <div className="tahun">
                            <Select
                                onValueChange={handleYearChange}
                                value={selectedYear || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Semua</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedFilter === 'month' && (
                        <div className="bulan">
                            <Select
                                onValueChange={handleMonthChange}
                                value={selectedMonth || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Semua</SelectItem>
                                    <SelectItem value="1">Januari</SelectItem>
                                    <SelectItem value="2">Februari</SelectItem>
                                    <SelectItem value="3">Maret</SelectItem>
                                    <SelectItem value="4">April</SelectItem>
                                    <SelectItem value="5">Mei</SelectItem>
                                    <SelectItem value="6">Juni</SelectItem>
                                    <SelectItem value="7">Juli</SelectItem>
                                    <SelectItem value="8">Agustus</SelectItem>
                                    <SelectItem value="9">September</SelectItem>
                                    <SelectItem value="10">Oktober</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">Desember</SelectItem>
                                    {/* Add more months if needed */}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-3 grid-cols-1 gap-3">
                <DashCard label='Jumlah Panen Padi' value={padiPanenCount} />
                <DashCard label='Jumlah Tanam Padi' value={padiTanamCount} />
                <DashCard label='Jumlah Puso' value={padiPusoCount} />
            </div>
            {/* tables */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Palawija" link="/korluh/palawija" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Komoditas</TableHead>
                                <TableHead className="text-primary p-0">Panen</TableHead>
                                <TableHead className="text-primary p-0">Tanam</TableHead>
                                <TableHead className="text-primary p-0">Puso</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhPalawija?.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.nama}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.panen}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.tanam}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.puso}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Sayuran dan Buah" link="/korluh/sayuran-buah" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Hasil Produksi</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhSayurBuah?.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.namaTanaman}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.hasilProduksi}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.luas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="tablee h-fit md:h-[320px] mt-3 flex md:flex-row flex-col gap-3">
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Hias" link="/korluh/tanaman-hias" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Harga</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhTanamanHias?.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.namaTanaman}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.luas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Biofarmaka" link="/korluh/tanaman-biofarmaka" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Harga</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhTanamanBiofarmaka?.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.namaTanaman}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.luas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashboardBPPKecamatan;
