import Link from 'next/link'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import HeaderDash from '@/components/HeaderDash'
import DashCard from '@/components/DashCard';
import useSWR, { SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';

// Interface for API response data
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

const DashboardKJFKabupaten = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKorluh }: SWRResponse<DashboardDataResponse> = useSWR(
        `/korluh/dashboard/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    if (!dataKorluh) return <div>Loading...</div>;

    const { padiPanenCount, padiTanamCount, padiPusoCount, korluhPalawija, korluhSayurBuah, korluhTanamanHias, korluhTanamanBiofarmaka } = dataKorluh.data;

    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl mb-4 font-semibold text-primary uppercase">Dashboard KJF Kabupaten</div>
            {/* card */}
            <div className="wrap-card grid md:grid-cols-3 grid-cols-1 gap-3">
                <DashCard label='Jumlah Panen Padi' value={padiPanenCount} />
                <DashCard label='Jumlah Tanam Padi' value={padiTanamCount} />
                <DashCard label='Jumlah Puso' value={padiPusoCount} />
            </div>
            {/* tables */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Palawija" link="/kjf-kabupaten/palawija" />
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
                            {korluhPalawija.map((data, index) => (
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
                    <HeaderDash label="Sayuran dan Buah" link="/kjf-kabupaten/sayuran-buah" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Hasil Produksi</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhSayurBuah.map((data, index) => (
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
                    <HeaderDash label="Tanaman Hias" link="/kjf-kabupaten/tanaman-hias" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Harga</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhTanamanHias.map((data, index) => (
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
                    <HeaderDash label="Tanaman Biofarmaka" link="/kjf-kabupaten/tanaman-biofarmaka" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Harga</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {korluhTanamanBiofarmaka.map((data, index) => (
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
}

export default DashboardKJFKabupaten;
