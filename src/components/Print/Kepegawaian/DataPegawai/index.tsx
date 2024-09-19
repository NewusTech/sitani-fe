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

const KepegawaianDataPegawaiPrint = (props: PrintProps) => {

    // INTEGRASI
    // GET LIST
    interface Response {
        status: string,
        data: ResponseData,
        message: string
    }

    interface ResponseData {
        data: Data[];
        pagination: Pagination;
    }

    interface Pagination {
        page: number,
        perPage: number,
        totalPages: number,
        totalCount: number,
    }

    interface Data {
        id?: number;
        nama?: string;
        nip?: number;
        tempatLahir?: string;
        tglLahir?: string;
        pangkat?: string;
        golongan?: string;
        tmtPangkat?: string;
        jabatan?: string;
        tmtJabatan?: string;
        namaDiklat?: string;
        tglDiklat?: string;
        totalJam?: number;
        namaPendidikan?: string;
        tahunLulus?: number;
        jenjangPendidikan?: string;
        usia?: string;
        masaKerja?: string;
        keterangan?: string;
        status?: string;
        bidang_id?: number;
        bidang?: Bidang;
    }

    interface Bidang {
        id?: number;
        nama?: string;
        createdAt?: number;
        updatedAt?: number;
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
                pdf.save(`DATA_APARATUR_SIPIL_NEGARA.pdf`);

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
                        <DropdownMenuLabel>Pilih Unduhan</DropdownMenuLabel>
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
                            DATA APARATUR SIPIL NEGARA
                        </div>
                        <div className="text-2xl font-bold text-black mx-auto uppercase flex justify-center text-center">
                            DINAS KETAHANAN PANGAN, TANAMAN PANGAN, HOLTIKULTURA DAN PERKEBUNAN
                        </div>
                        {/* title */}
                        <div className="uppercase text-end mt-10 text-sm font-semibold">BERLAKU UNTUK TAHUN {currentYear}</div>
                        {/* table */}
                        <Table className='border border-[#D9D9D9] mt-4 uppercase'>
                            <TableHeader className='bg-[#D9D9D9]'>
                                <TableRow >
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">
                                        No
                                    </TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">
                                        Nama/NIP
                                        <br /> Tempat/Tgl Lahir
                                    </TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">
                                        Pangkat/Gol <br />
                                        Ruang <br />
                                        TMT Pangkat
                                    </TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1 border border-zinc-400 text-center font-semibold">
                                        Jabatan <br />
                                        TMT Jabatan
                                    </TableHead>
                                    <TableHead colSpan={3} className="text-black py-1 border border-zinc-400 text-center font-semibold ">
                                        Diklat Struktural
                                    </TableHead>
                                    <TableHead colSpan={3} className="text-black py-1 border border-zinc-400 text-center font-semibold ">
                                        Pendidikan Umum
                                    </TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1  border border-zinc-400 text-center font-semibold">Usia</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1  border border-zinc-400 text-center font-semibold">Masa Kerja</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1  border border-zinc-400 text-center font-semibold">Ket</TableHead>
                                    <TableHead rowSpan={2} className="text-black py-1  border border-zinc-400 text-center font-semibold">Status</TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="text-black py-1  border border-zinc-400 text-center font-semibold">
                                        Nama  DIklat
                                    </TableHead>
                                    <TableHead className="text-black py-1  border border-zinc-400 text-center font-semibold">
                                        Tanggal
                                    </TableHead>
                                    <TableHead className="text-black py-1  border border-zinc-400 text-center font-semibold">
                                        Jam
                                    </TableHead>
                                    <TableHead className="text-black py-1  border border-zinc-400 text-center font-semibold">
                                        Nama
                                    </TableHead>
                                    <TableHead className="text-black py-1  border border-zinc-400 text-center font-semibold">
                                        Tahun Lulus
                                    </TableHead>
                                    <TableHead className="text-black py-1  border border-zinc-400 text-center font-semibold">
                                        Jenjang
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataKepegawaian?.data.data && dataKepegawaian?.data.data.length > 0 ? (
                                    dataKepegawaian?.data.data.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell className='text-black border border-zinc-400'>{index + 1}</TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.nama} <br />
                                                {item.nip === 0 ? (
                                                    <span></span>
                                                ) : (
                                                    <span>{item.nip}</span>
                                                )}
                                                <br />
                                                {item.tempatLahir}, {item.tglLahir}
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.pangkat} / {item.golongan} <br />
                                                TMT :  <span>
                                                    {item.tmtPangkat && !isNaN(new Date(item.tmtPangkat).getTime())
                                                        ? formatDate(new Date(item.tmtPangkat))
                                                        : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.jabatan} <br />
                                                TMT : <span>
                                                    {item.tmtJabatan && !isNaN(new Date(item.tmtJabatan).getTime())
                                                        ? formatDate(new Date(item.tmtJabatan))
                                                        : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.namaDiklat} <br />
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                <span>
                                                    {item.tglDiklat && !isNaN(new Date(item.tglDiklat).getTime())
                                                        ? formatDate(new Date(item.tglDiklat))
                                                        : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.totalJam === 0 ? (
                                                    <span></span>
                                                ) : (
                                                    <span>{item.totalJam} Jam</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.namaPendidikan}
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.tahunLulus === 0 ? (
                                                    <span></span>
                                                ) : (
                                                    <span>{item.tahunLulus}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                {item.jenjangPendidikan}
                                            </TableCell>
                                            <TableCell className='text-black border border-zinc-400'>{item.usia}</TableCell>
                                            <TableCell className='text-black border border-zinc-400'>{item.masaKerja}</TableCell>
                                            <TableCell className='text-black border border-zinc-400'>{item.keterangan}</TableCell>
                                            <TableCell className='text-black border border-zinc-400'>
                                                <div className="p-1 text-xs rounded bg-[#D9D9D9] text-center">
                                                    {item.status}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={15} className="text-center">
                                            Tidak ada data
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

export default KepegawaianDataPegawaiPrint