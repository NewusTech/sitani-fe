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
import Swal from 'sweetalert2';


interface PrintProps {
    urlApi?: string;
    tahun?: string;
    kecamatan?: string;
}

const TPHBukanSawah = (props: PrintProps) => {

    // INTEGRASI
    // GET LIST
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface LahanBukanSawahDetail {
        id: number;
        tphLahanBukanSawahId: number;
        kecamatanId: number;
        tegal: number;
        ladang: number;
        perkebunan: number;
        hutanRakyat: number;
        padangPengembalaanRumput: number;
        hutanNegara: number;
        smtTidakDiusahakan: number;
        lainnya: number;
        jumlahLahanBukanSawah: number;
        lahanBukanPertanian: number;
        total: number;
        kecamatan: Kecamatan;
    }

    interface LahanBukanSawahData {
        detail: {
            tahun: number;
            list: LahanBukanSawahDetail[];
        };
        total: number;
        jumlahLahanBukanSawah: number;
        padangPengembalaanRumput: number;
        smtTidakDiusahakan: number;
        hutanNegara: number;
        hutanRakyat: number;
        lainnya: number;
        perkebunan: number;
        ladang: number;
        tegal: number;
        lahanBukanPertanian: number;
    }

    interface Response {
        status: number;
        message: string;
        data: LahanBukanSawahData;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
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
    //   
    // GET LIST
    const { data: responseData, } = useSWR<Response>(
        // `tph/lahan-bukan-sawah/get?year=2024&kecamatan=`,
        `${props.urlApi}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    // INTEGRASI
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface ResponseFilter {
        status: string;
        data: Kecamatan;
        message: string;
    }

    // DATA FILTER PDF
    const { data: dataFilter, error } = useSWR<ResponseFilter>(
        `/kecamatan/get/${props.kecamatan}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        }
    );
    //PRINT
    // print
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    // download Excel
    const handleDownloadExcel = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/download/tph-lahan-bukan-sawah?kecamatan=${props.kecamatan}&year=${props.tahun}`;

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
            link.setAttribute('download', `Data Tanaman Pangan Holtikultura Lahan Sawah Kabupaten Lampung Timur.xlsx`); // Nama file yang diunduh
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
                pdf.save(`Data Tanaman Pangan Holtikultura Lahan Sawah Kabupaten Lampung Timur.pdf`);

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
            <div className="absolute -left-full w-full">
                {/* <div className=""> */}
                <div ref={printRef} className='p-[50px]'>
                    {/* title */}
                    <div className="text-xl mb-4 font-semibold text-black mx-auto uppercase flex justify-center text-center">
                        DATA LUAS LAHAN BUKAN SAWAH MENURUT PENGGUNAANNYA <br />
                        Dinas Tanaman Pangan, Hortikultura dan Perkebunan Kabupaten Lampung Timur / Laporan Tahun {props.tahun || currentYear}
                    </div>
                    {/* title */}
                    {/* table */}
                    <Table className='border border-black p-2 mt-1'>
                        <TableHeader className='bg-gray-100 text-black'>
                            <TableRow >
                                <TableHead rowSpan={2} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    No
                                </TableHead>
                                <TableHead rowSpan={2} className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    Kecamatan
                                </TableHead>
                                <TableHead colSpan={9} className="border border-black p-2 text-black uppercase text-center font-semibold ">
                                    Lahan Bukan Sawah
                                </TableHead>
                                <TableHead colSpan={1} className="border border-black p-2 text-black uppercase text-center font-semibold ">
                                    Lahan Bukan Pertanian
                                </TableHead>
                                <TableHead rowSpan={2} className="border border-black p-2 text-black uppercase text-center font-semibold ">
                                    Total
                                </TableHead>
                            </TableRow>
                            <TableRow>
                                <>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Tegal/Kebun
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Ladang/Huma
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Perkebunan
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Hutan Rakyat
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Padang Penggembalaan Rumput
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Hutan Negara
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Smt. Tidak Diusahakan
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Lainnya Tambak, Kolam Empang
                                    </TableHead>
                                    <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                        Jumlah Lahan Bukan Sawah
                                    </TableHead>
                                </>
                                <TableHead className="border border-black p-2 text-black uppercase text-center font-semibold">
                                    Jalan, Pemukiman, Perkantoran, Sungai
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responseData?.data && responseData?.data?.detail?.list?.length > 0 ? (
                                responseData?.data?.detail?.list.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className='border border-black p-2 text-black text-center'>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black text-center'>
                                            {item?.kecamatan.nama}
                                        </TableCell>
                                        <>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.tegal}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.ladang}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.perkebunan}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.hutanRakyat}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.padangPengembalaanRumput}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.hutanNegara}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.smtTidakDiusahakan}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.lainnya}
                                            </TableCell>
                                            <TableCell className='border border-black p-2 text-black text-center'>
                                                {item?.jumlahLahanBukanSawah}
                                            </TableCell>
                                        </>
                                        <TableCell className='border border-black p-2 text-black text-center'>
                                            {item?.lahanBukanPertanian}
                                        </TableCell>
                                        <TableCell className='border border-black p-2 text-black text-center'>
                                            {item?.total}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={13} className="border border-black p-2 text-black text-center">
                                        Tidak ada data
                                    </TableCell>
                                </TableRow>
                            )}
                            <TableRow className='bg-gray-100 text-black'>
                                <TableCell className='border border-black p-2 text-black text-center'>
                                </TableCell>
                                <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                    Jumlah
                                </TableCell>
                                <>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.tegal}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.ladang}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.perkebunan}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.hutanRakyat}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.padangPengembalaanRumput}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.hutanNegara}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.smtTidakDiusahakan}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.lainnya}
                                    </TableCell>
                                    <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                        {responseData?.data?.jumlahLahanBukanSawah}
                                    </TableCell>
                                </>
                                <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                    {responseData?.data?.lahanBukanPertanian}
                                </TableCell>
                                <TableCell className='border border-black p-2 text-black text-center font-semibold'>
                                    {responseData?.data?.total}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>

        </div>
    )
}

export default TPHBukanSawah