"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import SearchIcon from "../../../../../public/icons/SearchIcon";
import { Button } from "@/components/ui/button";
import UnduhIcon from "../../../../../public/icons/UnduhIcon";
import PrintIcon from "../../../../../public/icons/PrintIcon";
import FilterIcon from "../../../../../public/icons/FilterIcon";
import Link from "next/link";
import EditIcon from "../../../../../public/icons/EditIcon";
import EyeIcon from "../../../../../public/icons/EyeIcon";

// Filter di mobile
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import Label from '@/components/ui/label'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'
import {
	Cloud,
	CreditCard,
	Github,
	Keyboard,
	LifeBuoy,
	LogOut,
	Mail,
	MessageSquare,
	Plus,
	PlusCircle,
	Settings,
	User,
	UserPlus,
	Users,
	Filter,
} from "lucide-react"
// Filter di mobile

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DeletePopup from "@/components/superadmin/PopupDelete";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
//
import useSWR from "swr";
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLocalStorage from "@/hooks/useLocalStorage";
import PaginationTable from "@/components/PaginationTable";
import KorluhPadiMobileComp from "@/components/KorluhMobile/koruhPadiMobile";
import Swal from "sweetalert2";
import ComponentWithAccess from "@/components/auth/componentWithAccess";
import { PERMISSIONS } from "@/utils/permissions";
import NotFoundSearch from "@/components/SearchNotFound";
import DeletePopupTitik from "@/components/superadmin/TitikDelete";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"
import TambahIcon from "../../../../../public/icons/TambahIcon";
import CekStatus from "../../../../../public/icons/CekStatus";

const KorlubPadi = () => {
	const formatDate = (date?: Date): string => {
		if (!date) return ""; // Return an empty string if the date is undefined
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // getMonth() is zero-based
		const day = date.getDate();

		return `${year}/${month}/${day}`;
	};
	const [startDate, setstartDate] = React.useState<Date>();
	const filterDate = formatDate(startDate);
	// console.log(filterDate)

	// INTEGRASI
	interface Padi {
		id: number;
		kecamatanId: number;
		desaId: number;
		kecamatan: Kecamatan;
		desa: Desa;
		tanggal: string;
		hibrida_bantuan_pemerintah_lahan_sawah_panen: number;
		hibrida_bantuan_pemerintah_lahan_sawah_tanam: number;
		hibrida_bantuan_pemerintah_lahan_sawah_puso: number;
		hibrida_non_bantuan_pemerintah_lahan_sawah_panen: number;
		hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: number;
		hibrida_non_bantuan_pemerintah_lahan_sawah_puso: number;
		unggul_bantuan_pemerintah_lahan_sawah_panen: number;
		unggul_bantuan_pemerintah_lahan_sawah_tanam: number;
		unggul_bantuan_pemerintah_lahan_sawah_puso: number;
		unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
		unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
		unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
		unggul_non_bantuan_pemerintah_lahan_sawah_panen: number;
		unggul_non_bantuan_pemerintah_lahan_sawah_tanam: number;
		unggul_non_bantuan_pemerintah_lahan_sawah_puso: number;
		unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
		unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
		unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
		lokal_lahan_sawah_panen: number;
		lokal_lahan_sawah_tanam: number;
		lokal_lahan_sawah_puso: number;
		lokal_lahan_bukan_sawah_panen: number;
		lokal_lahan_bukan_sawah_tanam: number;
		lokal_lahan_bukan_sawah_puso: number;
		sawah_irigasi_lahan_sawah_panen: number;
		sawah_irigasi_lahan_sawah_tanam: number;
		sawah_irigasi_lahan_sawah_puso: number;
		sawah_tadah_hujan_lahan_sawah_panen: number;
		sawah_tadah_hujan_lahan_sawah_tanam: number;
		sawah_tadah_hujan_lahan_sawah_puso: number;
		sawah_rawa_pasang_surut_lahan_sawah_panen: number;
		sawah_rawa_pasang_surut_lahan_sawah_tanam: number;
		sawah_rawa_pasang_surut_lahan_sawah_puso: number;
		sawah_rawa_lebak_lahan_sawah_panen: number;
		sawah_rawa_lebak_lahan_sawah_tanam: number;
		sawah_rawa_lebak_lahan_sawah_puso: number;
	}

	interface Kecamatan {
		id: number;
		nama: string;
		createdAt: string; // ISO Date string
		updatedAt: string; // ISO Date string
	}

	interface Desa {
		id: number;
		nama: string;
		kecamatanId: number;
		tanggal: string;
		createdAt: string; // ISO Date string
		updatedAt: string; // ISO Date string
	}

	interface Pagination {
		page: number;
		perPage: number;
		totalPages: number;
		totalCount: number;
	}

	interface ResponseData {
		data: Padi[];
		pagination: Pagination;
	}

	interface Response {
		status: string;
		data: ResponseData;
		message: string;
	}
	const [accessToken] = useLocalStorage("accessToken", "");
	const axiosPrivate = useAxiosPrivate();
	const [search, setSearch] = useState("");
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};
	// pagination
	const [currentPage, setCurrentPage] = useState(1);
	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};
	// pagination

	// GETALL
	const { data: dataPadi }: SWRResponse<Response> = useSWR(
		// `korluh/padi/get?limit=1`,
		`korluh/padi/get?page=${currentPage}&search=${search}&limit=1&equalDate=${filterDate}`,
		(url) =>
			axiosPrivate
				.get(url, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res: any) => res.data)
	);
	console.log(dataPadi);

	const handleDelete = async (id: string) => {
		try {
			await axiosPrivate.delete(`/korluh/padi/delete/${id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			// alert
			Swal.fire({
				icon: "success",
				title: "Data berhasil dihapus!",
				text: "Data sudah disimpan sistem!",
				timer: 1500,
				timerProgressBar: true,
				showConfirmButton: false,
				showClass: {
					popup: "animate__animated animate__fadeInDown",
				},
				hideClass: {
					popup: "animate__animated animate__fadeOutUp",
				},
				customClass: {
					title: "text-2xl font-semibold text-green-600",
					icon: "text-green-500 animate-bounce",
					timerProgressBar:
						"bg-gradient-to-r from-blue-400 to-green-400", // Gradasi warna yang lembut
				},
				backdrop: `rgba(0, 0, 0, 0.4)`,
			});
			// alert
			console.log(id);
			// Update the local data after successful deletion
		} catch (error: any) {
			// Extract error message from API response
			const errorMessage =
				error.response?.data?.data?.[0]?.message ||
				"Gagal menghapus data!";
			Swal.fire({
				icon: "error",
				title: "Terjadi kesalahan!",
				text: errorMessage,
				showConfirmButton: true,
				showClass: { popup: "animate__animated animate__fadeInDown" },
				hideClass: { popup: "animate__animated animate__fadeOutUp" },
				customClass: {
					title: "text-2xl font-semibold text-red-600",
					icon: "text-red-500 animate-bounce",
				},
				backdrop: "rgba(0, 0, 0, 0.4)",
			});
			console.error("Failed to create user:", error);
		}
		mutate(
			`korluh/padi/get?page=${currentPage}&search=${search}&limit=1&equalDate=${filterDate}`
		);
	};

	return (
		<div>
			{/* title */}
			<div className="text-xl md:text-2xl mb-4 font-semibold text-primary capitalize">
				Korluh Padi
			</div>
			{/* title */}

			{/* Dekstop */}
			<div className="hidden md:block">
				<>
					{/* top */}
					<div className="lg:flex gap-2 lg:justify-between lg:items-center w-full mt-2 lg:mt-4">
						<div className="wrap-filter left gap-2 lg:gap-2 flex justify-start items-center w-full">
							<div className="md:w-auto w-full">
								<Popover>
									<PopoverTrigger
										className="lg:py-4 lg:px-4 px-2"
										asChild
									>
										<Button
											variant={"outline"}
											className={cn(
												"w-full justify-start text-left font-normal text-xs md:text-sm",
												!startDate && "text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
											{startDate ? (
												format(startDate, "PPP")
											) : (
												<span>Pilih Tanggal</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											className=""
											mode="single"
											selected={startDate}
											onSelect={setstartDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							{/* filter table */}
							{/* <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div> */}
							<div className="header flex gap-2 justify-end items-center">
								<div className="btn flex gap-2">
									{/* <Button
								variant={"outlinePrimary"}
								className="flex gap-2 items-center text-primary"
							>
								<UnduhIcon />
								<div className="hidden md:block">Download</div>
							</Button>
							<Button
								variant={"outlinePrimary"}
								className="flex gap-2 items-center text-primary"
							>
								<PrintIcon />
								<div className="hidden md:block">Print</div>
							</Button> */}
								</div>
							</div>
						</div>
						<div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
							{/* <div className="w-full">
                        <Select >
                            <SelectTrigger>
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
							<ComponentWithAccess
								allowPermissions={[
									PERMISSIONS.semua,
									PERMISSIONS.korluhPadi[0],
								]}
							>
								<Link
									href="/status-laporan/padi"
									className="bg-blue-500 px-3 md:px-8 py-2 rounded-full text-white hover:bg-blue-500/80 p-2 border border-blue-500 text-center font-medium text-base mb-3"
								>
									Cek Status
								</Link>
								<Link
									href="/korluh/padi/tambah"
									className="bg-primary px-3 md:px-8 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-base mb-3"
								>
									Tambah
								</Link>
							</ComponentWithAccess>
						</div>
					</div>
					{/* top */}
				</>
				{/* bulan */}
				<div className="md:mt-2 mt-1 flex items-center gap-2">
					<div className="font-semibold">Tanggal:</div>
					{dataPadi?.data?.data.map((item, index) => (
						<div key={index}>
							{item.tanggal
								? new Date(item.tanggal).toLocaleDateString(
									"id-ID",
									{
										weekday: "long",
										day: "numeric",
										month: "long",
										year: "numeric",
									}
								)
								: "Tanggal tidak tersedia"}
						</div>
					))}
				</div>
				{/* bulan */}
				{/* kecamatan */}
				<div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
					<div className="flex items-center gap-2">
						<div className="font-semibold">Kecamatan:</div>
						{dataPadi?.data?.data.map((item, index) => (
							<div key={index}>
								{item?.kecamatan.nama || "Tidak ada data"}
							</div>
						))}
					</div>
				</div>
				{/* kecamatan */}
			</div>
			{/* Dekstop */}

			{/* Mobile */}
			<div className="md:hidden">
				<>
					{/* Handle filter menu*/}
					<div className="flex justify-between w-full">
						<div className="flex justify-start w-fit gap-2">
							{/* More Menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outlinePrimary"
										className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
									>
										<Filter className="text-primary w-5 h-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md w-fit ml-5">
									<DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
										Menu Filter
									</DropdownMenuLabel>
									{/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
									<div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
									<div className="bg-white w-full h-full">
										<div className="flex flex-col w-full px-2 py-2">
											{/* Filter Kecamatan */}
											{/* <div className="w-full mb-2">
												
											</div> */}
											{/* Filter Kecamatan */}

											{/* Filter Desa */}
											{/* Filter Desa */}

											{/* Filter Rentang Tanggal */}
											{/* Filter Rentang Tanggal */}

											{/* Filter Tahun Bulan */}
											<>
												<Label className='text-xs mb-1 !text-black opacity-50' label="Tanggal" />
												<div className="flex gap-2 justify-between items-center w-full">
													{/* filter tahun */}
													<Popover>
														<PopoverTrigger
															className="lg:py-4 lg:px-4 px-2"
															asChild
														>
															<Button
																variant={"outline"}
																className={cn(
																	"w-full justify-start text-left font-normal text-xs md:text-sm",
																	!startDate && "text-muted-foreground"
																)}
															>
																<CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
																{startDate ? (
																	format(startDate, "PPP")
																) : (
																	<span>Pilih Tanggal</span>
																)}
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																className=""
																mode="single"
																selected={startDate}
																onSelect={setstartDate}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
													{/* Filter bulan */}
												</div>
											</>
											{/* Filter Tahun Bulan */}

										</div>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
							{/* More Menu */}

							{/* filter kolom */}
							{/* <FilterTable
								columns={columns}
								defaultCheckedKeys={getDefaultCheckedKeys()}
								onFilterChange={handleFilterChange}
							/> */}
							{/* filter kolom */}

							{/* unduh print */}
							{/* <KetahananPanganProdusenEceranPrint
                                urlApi={`/kepang/produsen-eceran/get?page=${currentPage}&year=${tahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                            /> */}
							{/* unduh print */}
						</div>

						{/* Tambah Data */}
						<div className="flex justify-end items-center w-fit">
							<Link
								href="/status-laporan/padi"
								className='bg-blue-500 text-xs px-3 rounded-full text-white hover:bg-blue-500/80 border border-blue-500 text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2 mr-2'>
								{/* Tambah */}
								Cek Status
							</Link>
							<Link
								href="/korluh/padi/tambah"
								className='bg-primary text-xs px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-end flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 py-2'>
								{/* Tambah */}
								<TambahIcon />
							</Link>
						</div>
						{/* Tambah Data */}
					</div>

					{/* Hendle Search */}
					<div className="mt-2 search w-full">
						{/* <Input
							autoFocus
							type="text"
							placeholder="Cari"
							value={search}
							onChange={handleSearchChange}
							rightIcon={<SearchIcon />}
							className='border-primary py-2 text-xs'
						/> */}
					</div>
					{/* Hendle Search */}
					<div className="card-table text-xs p-4 rounded-2xl border border-primary bg-white shadow-sm mt-4">
						<div className="flex items-center gap-2 justify-between">
							<div className="font-semibold">Tanggal:</div>
							{dataPadi?.data?.data.map((item, index) => (
								<div key={index}>
									{item.tanggal
										? new Date(item.tanggal).toLocaleDateString(
											"id-ID",
											{
												weekday: "long",
												day: "numeric",
												month: "long",
												year: "numeric",
											}
										)
										: "Tanggal tidak tersedia"}
								</div>
							))}
						</div>
						{/* bulan */}
						{/* kecamatan */}
						<div className="wrap mt-2 flex flex-col gap-1">
							<div className="flex items-center gap-2 justify-between">
								<div className="font-semibold">Kecamatan:</div>
								{dataPadi?.data?.data.map((item, index) => (
									<div key={index}>
										{item?.kecamatan.nama || "Tidak ada data"}
									</div>
								))}
							</div>
						</div>
					</div>
				</>
			</div>
			{/* Mobile */}

			{/* mobile table */}
			<div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
				{dataPadi?.data.data &&
					dataPadi.data.data.length > 0 ? (
					dataPadi.data.data.map((item, index) => (
						<>
							<div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
								<div className="wrap-konten flex flex-col gap-2">
									<Carousel>
										{/* <div className="flex justify-between gap-2 mb-2">
											<CarouselPrevious className='' />
											<CarouselNext className='' />
										</div> */}
										<CarouselContent>
											<CarouselItem>
												<>
													<div className="flex justify-between gap-5">
														<div className="label font-medium text-black">1.</div>
														<div className="konten text-black/80 text-end">Jenis Padi</div>
													</div>
													<div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse mt-2 mb-2"></div>
													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																A. Hibrida
															</div>

															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">1). Bantuan Pemerintah</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.hibrida_bantuan_pemerintah_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">		{item.hibrida_bantuan_pemerintah_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">					{item.hibrida_bantuan_pemerintah_lahan_sawah_puso ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																-
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">
																-
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
															<div className="konten text-black/80 text-end">
																-
															</div>
														</div>
														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																2). Non Bantuan Pemerintah
															</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.hibrida_non_bantuan_pemerintah_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">		{item.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">						{item.hibrida_non_bantuan_pemerintah_lahan_sawah_puso ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																-
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">
																-
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
															<div className="konten text-black/80 text-end">
																-
															</div>
														</div>
													</div>
													<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																B. Unggul (Non Hibrida)
															</div>

															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">1). Bantuan Pemerintah</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_bantuan_pemerintah_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">													{item.unggul_bantuan_pemerintah_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">						{item.unggul_bantuan_pemerintah_lahan_sawah_puso ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ??
																	"-"}
															</div>
														</div>
														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																2). Non Bantuan Pemerintah
															</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_non_bantuan_pemerintah_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">		{item.unggul_non_bantuan_pemerintah_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">					{item.unggul_non_bantuan_pemerintah_lahan_sawah_puso ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
															<div className="konten text-black/80 text-end">
																{item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ??
																	"-"}
															</div>
														</div>
													</div>
													<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																C. Lokal
															</div>

															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.lokal_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">													{item.lokal_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">						{item.lokal_lahan_sawah_puso ?? "-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.lokal_lahan_bukan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">
																{item.lokal_lahan_bukan_sawah_tanam ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Bukan Sawah Puso</div>
															<div className="konten text-black/80 text-end">
																{item.lokal_lahan_bukan_sawah_puso ??
																	"-"}
															</div>
														</div>
														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													</div>
												</>
												<>
													<div className="flex justify-between gap-5">
														<div className="label font-medium text-black">2.</div>
														<div className="konten text-black/80 text-end">Jenis Pengairan</div>
													</div>
													<div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse mt-2 mb-2"></div>
													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																A. Sawah Irigasi
															</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.sawah_irigasi_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">	{item.sawah_irigasi_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">				{item.sawah_irigasi_lahan_sawah_puso ??
																"-"}
															</div>
														</div>

														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													</div>

													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																B. Sawah Tadah Hujan
															</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.sawah_tadah_hujan_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">		{item.sawah_tadah_hujan_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">				{item.sawah_tadah_hujan_lahan_sawah_puso ??
																"-"}
															</div>
														</div>

														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													</div>

													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																C. Sawah Rawa Pasang Surut
															</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.sawah_rawa_pasang_surut_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">		{item.sawah_rawa_pasang_surut_lahan_sawah_tanam ??
																"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">			{item.sawah_rawa_pasang_surut_lahan_sawah_puso ??
																"-"}
															</div>
														</div>

														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													</div>

													<div className="">
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">
																D. Sawah Rawa Lebak
															</div>
															<div className="konten text-black/80 text-end"></div>
														</div>
														<hr className="border border-primary transition-all ease-in-out animate-pulse mb-2 mt-2" />

														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Panen</div>
															<div className="konten text-black/80 text-end">
																{item.sawah_rawa_lebak_lahan_sawah_panen ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Tanam</div>
															<div className="konten text-black/80 text-end">
																{item.sawah_rawa_lebak_lahan_sawah_tanam ??
																	"-"}
															</div>
														</div>
														<div className="flex justify-between gap-5">
															<div className="label font-medium text-black">Lahan Sawah Puso</div>
															<div className="konten text-black/80 text-end">			{item.sawah_rawa_lebak_lahan_sawah_puso ??
																"-"}
															</div>
														</div>

														<hr className="border border-primary-600 transition-all ease-in-out animate-pulse mb-2 mt-2" />
													</div>
												</>
											</CarouselItem>
										</CarouselContent>
									</Carousel>
								</div>
								<div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse my-3"></div>
								<div className="flex gap-3 text-white">
									<Link href={`/korluh/padi/detail/${item.id}`} className="bg-primary rounded-full w-full py-2 text-center">
										Detail
									</Link>
									<Link href={`/korluh/padi/edit/${item.id}`} className="bg-yellow-400 rounded-full w-full py-2 text-center">
										Edit
									</Link>
									<div className="w-full">
										<DeletePopupTitik className='bg-red-500 text-white rounded-full w-full py-2' onDelete={() => handleDelete(String(item.id) || "")} />
									</div>
								</div>
							</div>
						</>
					))
				) : (
					<div className="text-center">
						<NotFoundSearch />
					</div>
				)}
			</div >
			{/* mobile table */}

			{/* table */}
			<div className="hidden md:block" >
				<Table className="border border-slate-200 mt-1">
					<TableHeader className="bg-primary-600">
						<TableRow>
							<TableHead
								rowSpan={2}
								className="text-primary border border-slate-200 text-center py-1"
							>
								No
							</TableHead>
							<TableHead
								rowSpan={2}
								className="text-primary border border-slate-200 text-center py-1"
							>
								Uraian
							</TableHead>
							<TableHead
								colSpan={3}
								className="text-primary border border-slate-200 text-center py-1"
							>
								Lahan Sawah
							</TableHead>
							<TableHead
								colSpan={3}
								className="text-primary border border-slate-200 text-center py-1"
							>
								Laha Bukan Sawah
							</TableHead>
							<TableHead
								rowSpan={3}
								className="text-primary py-1 text-center"
							>
								Aksi
							</TableHead>
						</TableRow>
						<TableRow>
							<TableHead className="text-primary border border-slate-200 text-center py-1">
								Panen
							</TableHead>
							<TableHead className="text-primary border border-slate-200 text-center py-1">
								Tanam
							</TableHead>
							<TableHead className="text-primary border border-slate-200 text-center py-1">
								Puso
							</TableHead>
							<TableHead className="text-primary border border-slate-200 text-center py-1">
								Panen
							</TableHead>
							<TableHead className="text-primary border border-slate-200 text-center py-1">
								Tanam
							</TableHead>
							<TableHead className="text-primary border border-slate-200 text-center py-1">
								Puso
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{dataPadi?.data.data &&
							dataPadi.data.data.length > 0 ? (
							dataPadi.data.data.map((item, index) => (
								<>
									{/* jenis padi */}
									<TableRow>
										<TableCell className="border border-slate-200 font-semibold text-center">
											1.
										</TableCell>
										<TableCell className="border border-slate-200 font-semibold">
											Jenis Padi
										</TableCell>
										<TableCell
											colSpan={6}
											className="border border-slate-200 font-semibold"
										></TableCell>
										<TableCell
											rowSpan={2}
											className="border border-slate-200 font-semibold"
										>
											<div className="flex items-center gap-4 justify-center">
												<Link
													className=""
													href={`/korluh/padi/detail/${item.id}`}
												>
													<EyeIcon />
												</Link>
												<Link
													className=""
													href={`/korluh/padi/edit/${item.id}`}
												>
													<EditIcon />
												</Link>
												<DeletePopup
													onDelete={() =>
														handleDelete(
															String(item.id) ||
															""
														)
													}
												/>
											</div>
										</TableCell>
									</TableRow>
									{/* hibrida */}
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 font-semibold ">
											A. Hibrida
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 ">
											1). Bantuan Pemerintah
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.hibrida_bantuan_pemerintah_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.hibrida_bantuan_pemerintah_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.hibrida_bantuan_pemerintah_lahan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 ">
											2). Non Bantuan Pemerintah
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.hibrida_non_bantuan_pemerintah_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.hibrida_non_bantuan_pemerintah_lahan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* hibrida */}
									{/* Non hibrida */}
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 font-semibold ">
											B. Unggul (Non Hibrida)
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 ">
											1). Bantuan Pemerintah
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_bantuan_pemerintah_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_bantuan_pemerintah_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_bantuan_pemerintah_lahan_sawah_puso ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 ">
											2). Non Bantuan Pemerintah
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_non_bantuan_pemerintah_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_non_bantuan_pemerintah_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_non_bantuan_pemerintah_lahan_sawah_puso ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* Non hibrida */}
									{/* Lokal */}
									<TableRow>
										<TableCell></TableCell>
										<TableCell className="border border-slate-200 font-semibold ">
											C. Lokal
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.lokal_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.lokal_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.lokal_lahan_sawah_puso ?? "-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.lokal_lahan_bukan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.lokal_lahan_bukan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border border-slate-200 text-center">
											{item.lokal_lahan_bukan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* jenis padi */}
									{/* Jenis pengairan */}
									<TableRow>
										<TableCell className="border border-slate-200 font-semibold text-center">
											2.
										</TableCell>
										<TableCell className="border border-slate-200 font-semibold">
											Jenis Pengairan
										</TableCell>
									</TableRow>
									{/* sawah irigasi */}
									<TableRow>
										<TableCell className="border border-slate-200"></TableCell>
										<TableCell className="border border-slate-200">
											A. Sawah Irigasi
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_irigasi_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_irigasi_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_irigasi_lahan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* sawah irigasi */}
									{/* sawah tadah hujan */}
									<TableRow>
										<TableCell className="border border-slate-200"></TableCell>
										<TableCell className="border border-slate-200">
											B. Sawah Tadah Hujan
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_tadah_hujan_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_tadah_hujan_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_tadah_hujan_lahan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* sawah tadah hujan */}
									{/* sawah Rawa Pasang Surut */}
									<TableRow>
										<TableCell className="border border-slate-200"></TableCell>
										<TableCell className="border border-slate-200">
											C. Sawah Rawa Pasang Surut
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_rawa_pasang_surut_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_rawa_pasang_surut_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_rawa_pasang_surut_lahan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* sawah Rawa Pasang Surut */}
									{/* sawah Rawa Lebak */}
									<TableRow>
										<TableCell className="border border-slate-200"></TableCell>
										<TableCell className="border border-slate-200">
											D. Sawah Rawa Lebak
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_rawa_lebak_lahan_sawah_panen ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_rawa_lebak_lahan_sawah_tanam ??
												"-"}
										</TableCell>
										<TableCell className="border text-center border-slate-200">
											{item.sawah_rawa_lebak_lahan_sawah_puso ??
												"-"}
										</TableCell>
									</TableRow>
									{/* sawah Rawa Lebak */}
									{/* Jenis pengairan */}
								</>
							))
						) : (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									<NotFoundSearch />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{/* table */}
			{/* pagination */}
			<div className="pagi flex items-center lg:justify-end justify-center">
				{(dataPadi?.data.pagination.totalCount as number) > 1 && (
					<PaginationTable
						currentPage={currentPage}
						totalPages={
							dataPadi?.data.pagination.totalPages as number
						}
						onPageChange={onPageChange}
					/>
				)}
			</div>
			{/* pagination */}
		</div>
	);
};

export default KorlubPadi;
