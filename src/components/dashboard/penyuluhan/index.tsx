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

const DashboardPenyuluhan = () => {
    interface DesaBinaan {
        id: number;
        nama: string;
        kecamatanId: number;
    }

    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface PenyuluhKecamatan {
        id: number;
        kecamatanId: number;
        nama: string;
        nip: number;
        pangkat: string;
        golongan: string;
        kecamatan: Kecamatan;
        desa: DesaBinaan[];
    }

    interface PenyuluhResponseData {
        penyuluhKabupatenCount: number;
        penyuluhKecamatanCount: number;
        penyuluhKabupaten: any[];
        penyuluhKecamatan: PenyuluhKecamatan[];
    }

    interface Response {
        status: number;
        message: string;
        data: PenyuluhResponseData;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataPenyuluhan }: SWRResponse<Response> = useSWR(
        `/penyuluh/dashboard/get?limit=10`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const penyuluhKabupaten = dataPenyuluhan?.data.penyuluhKabupaten ?? [];
    const penyuluhKecamatan = dataPenyuluhan?.data.penyuluhKecamatan ?? [];

    return (
        <div>
            <div className="wrap flex justify-between">
                <div className="text-xl md:text-2xl mb-4 font-semibold text-primary uppercase">Dashboard Penyuluhan</div>
            </div>
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Penyuluh Kabupaten' value={dataPenyuluhan?.data.penyuluhKabupatenCount ?? 0} />
                <DashCard label='Penyuluh Kecamatan' value={dataPenyuluhan?.data.penyuluhKecamatanCount ?? 0} />
            </div>

            <div className="peuppo h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3 pb-5 md:pb-0">
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Penyuluh Kabupaten" link="/penyuluhan/data-kabupaten" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                <TableHead className="text-primary p-0">Nama</TableHead>
                                <TableHead className="text-primary p-0">NIP</TableHead>
                                <TableHead className="text-primary p-0">Gol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {penyuluhKabupaten.map((penyuluh, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{penyuluh.kecamatan?.nama || '-'}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.nama}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.nip}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.golongan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Penyuluh Kecamatan" link="/penyuluhan/data-kecamatan" />
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                <TableHead className="text-primary p-0">Nama</TableHead>
                                <TableHead className="text-primary p-0">Desa</TableHead>
                                <TableHead className="text-primary p-0">NIP</TableHead>
                                <TableHead className="text-primary p-0">Gol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {penyuluhKecamatan.map((penyuluh, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{penyuluh.kecamatan?.nama}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.nama}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.desa.map(d => d.nama).join(', ')}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.nip}</TableCell>
                                    <TableCell className='p-0 py-1'>{penyuluh.golongan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default DashboardPenyuluhan;
