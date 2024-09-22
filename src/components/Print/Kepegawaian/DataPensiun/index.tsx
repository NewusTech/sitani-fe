"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState, useRef } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import UnduhIcon from '../../../../../public/icons/UnduhIcon';
import PrintIcon from '../../../../../public/icons/PrintIcon';
// 
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Swal from 'sweetalert2'

interface PrintProps {
    urlApi?: string;
    startDate?: string;
    endDate?: string;
    kecamatan?: string;
    bidang?: string;
}

const KepegawaianDataPensiunPrint = (props: PrintProps) => {

    // INTEGRASI
    // GET LIST
    interface Bidang {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface PegawaiSudahPensiun {
        nama: string;
        nip: number;
        tempat_lahir: string;
        tgl_lahir: string;
        pangkat: string;
        golongan: string;
        tmt_pangkat: string;
        jabatan: string;
        tmt_jabatan: string;
        nama_diklat: string;
        tgl_diklat: string;
        total_jam: number;
        nama_pendidikan: string;
        tahun_lulus: number;
        usia: string;
        masa_kerja: string;
        usia_pensiun_tercapai: number;
        bidang: Bidang;
    }

    interface Pagination {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        links: {
            prev: string | null;
            next: string | null;
        };
    }

    interface Response {
        status: number;
        message: string;
        data: {
            pegawaiSudahPensiun: PegawaiSudahPensiun[];
            pagination: Pagination;
        };
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    // filter date
    const formatDate = (date?: Date): string => {
        if (!date) return ''; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two-digit month
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit day

        return `${year}-${month}-${day}`;
    };
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()
    // Memoize the formatted date to avoid unnecessary recalculations on each render
    const filterStartDate = React.useMemo(() => formatDate(startDate), [startDate]);
    const filterEndDate = React.useMemo(() => formatDate(endDate), [endDate]);
    // filter date   
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination
    // serach
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    // serach
    // limit
    const [limit, setLimit] = useState(10);
    // limit
    // State untuk menyimpan id kecamatan yang dipilih
    // const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
    const [selectedBidang, setSelectedBidang] = useState<string>("");

    const { data: dataKepegawaian }: SWRResponse<Response> = useSWR(
        // `/psp/pupuk/get`,
        `${props.urlApi}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    //PRINT
    // print
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    // download PDF
    const handleDownloadPDF = async () => {
        try {
            if (printRef.current) {
                const canvas = await html2canvas(printRef.current, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: 'a4',
                });

                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`DATA_PENSIUN_APARATUR_SIPIL_NEGARA.pdf`);

                // Notifikasi Swal sukses
                Swal.fire({
                    icon: "success",
                    title: "Berhasil download",
                    timer: 2000,
                    showConfirmButton: false,
                    position: "center",
                });
            }
        } catch (error) {
            // Notifikasi Swal error
            Swal.fire({
                icon: "error",
                title: "Gagal download!",
                timer: 2000,
                showConfirmButton: false,
                position: "center",
            });
            console.error('Error downloading the PDF:', error);
        }
    };

    // download Excel
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/kepegawaian`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.ms-excel',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `DATA_APARATUR_SIPIL_NEGARA.xlsx`); // Nama file yang diunduh
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link); // Hapus elemen setelah di-click
            Swal.fire({
                icon: "success",
                title: "Berhasil download",
                timer: 2000,
                showConfirmButton: false,
                position: "center",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal download!",
                timer: 2000,
                showConfirmButton: false,
                position: "center",
            });
            console.error('Error downloading the file:', error);
        }
    };

    //PRINT 
    const currentYear = new Date().getFullYear();

    return (
        <div className="">
            <div className="btn flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button onClick={handleDownloadPDF} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                            <UnduhIcon />
                            <div className="hidden md:block">
                                Download
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                            Pilih Unduhan
                        </DropdownMenuLabel>
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleDownloadPDF}>
                                Unduh PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadExcel}>
                                Unduh Excel
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handlePrint} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                    <PrintIcon />
                    <div className="hidden md:block">
                        Print
                    </div>
                </Button>
            </div>
            {/* KONTEN PRINT */}
            <div className="absolute -left-[700%] min-w-[39.7cm] w-full">
                <div ref={printRef} className='p-2'>
                    <div className="ata mb-4 flex justify-start">
                        <div className="wr w-full text-sm">
                            DOKUMEN DINAS KETAHANAN PANGAN, TANAMAN <br /> PANGAN, HOLTIKULTURA DAN PERKEBUNAN
                        </div>
                    </div>
                    <div className="">
                        {/* title */}
                        <div className="text-lg font-semibold text-black mx-auto uppercase flex justify-center">
                            DATA PENSIUN APARATUR SIPIL NEGARA
                        </div>
                        <div className="text-2xl font-bold text-black mx-auto uppercase flex justify-center text-center">
                            DINAS KETAHANAN PANGAN, TANAMAN PANGAN, HOLTIKULTURA DAN PERKEBUNAN
                        </div>
                        {/* title */}
                        <div className="uppercase text-end mt-10 text-sm font-semibold">BERLAKU UNTUK TAHUN {currentYear}</div>
                        {/* table */}
                        <Table className='border border-[#D9D9D9] mt-4 uppercase'>
                            <TableHeader className='bg-[#D9D9D9]'>
                                <TableRow>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">No</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">Nama/NIP <br /> Tempat/Tgl Lahir</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">Pangkat/Gol Ruang <br /> TMT Pangkat</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">Jabatan <br /> TMT Jabatan</TableHead>
                                    <TableHead colSpan={3} className="text-black py-1 border border-zinc-400 text-center font-semibold hidden md:table-cell">Diklat Struktural</TableHead>
                                    <TableHead colSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold hidden md:table-cell">Pendidikan Umum</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">Usia</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">Masa Kerja</TableHead>
                                    {/* <TableHead rowSpan={2} className="text-primary py-1">Aksi</TableHead> */}
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-black py-1 border border-zinc-400 text-center font-semibold">Nama Diklat</TableHead>
                                    <TableHead className="text-black py-1 border border-zinc-400 text-center font-semibold">Tanggal</TableHead>
                                    <TableHead className="text-black py-1 border border-zinc-400 text-center font-semibold">Jam</TableHead>
                                    <TableHead className="text-black py-1 border border-zinc-400 text-center font-semibold">Nama</TableHead>
                                    <TableHead className="text-black py-1 border border-zinc-400 text-center font-semibold">Tahun Lulus</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataKepegawaian?.data.pegawaiSudahPensiun && dataKepegawaian?.data.pegawaiSudahPensiun.length > 0 ? (
                                    dataKepegawaian.data.pegawaiSudahPensiun.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {item.nama} <br />
                                                {item.nip} <br />
                                                {item.tempat_lahir}, {item.tgl_lahir}
                                            </TableCell>
                                            <TableCell>
                                                TMT : {item.pangkat ? formatDate(new Date(item.pangkat)) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.jabatan} <br />
                                                TMT : {item.tmt_jabatan ? formatDate(new Date(item.tmt_jabatan)) : '-'}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>{item.nama_diklat}</TableCell>
                                            <TableCell className='hidden md:table-cell'>
                                                TMT : {item.tgl_diklat ? formatDate(new Date(item.tgl_diklat)) : '-'}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>
                                                {item.total_jam === 0 ? (
                                                    <span></span>
                                                ) : (
                                                    <span>{item.total_jam} Jam</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>{item.nama_pendidikan}</TableCell>
                                            <TableCell className='hidden md:table-cell'>
                                                {item.tahun_lulus === 0 ? (
                                                    <span></span>
                                                ) : (
                                                    <span>{item.tahun_lulus}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell'>{item.usia}</TableCell>
                                            <TableCell className='hidden md:table-cell'>{item.masa_kerja}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center">
                                            Tidak ada Data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {/* table */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KepegawaianDataPensiunPrint