"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import SearchIcon from "../../../../../../../../../../public/icons/SearchIcon";
import { Button } from "@/components/ui/button";
import UnduhIcon from "../../../../../../../../../../public/icons/UnduhIcon";
import PrintIcon from "../../../../../../../../../../public/icons/PrintIcon";
import FilterIcon from "../../../../../../../../../../public/icons/FilterIcon";
import Link from "next/link";
import EditIcon from "../../../../../../../../../../public/icons/EditIcon";
import EyeIcon from "../../../../../../../../../../public/icons/EyeIcon";

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
import TambahIcon from "../../../../../../../../../../public/icons/TambahIcon";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { useSearchParams, useParams } from 'next/navigation';


const KorlubPadiDetail = () => {
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

	const { kecamatan, tahun, bulan } = useParams(); // Menangkap parameter dinamis

	// GETALL
	const { data: dataPadi }: SWRResponse<Response> = useSWR(
		// `korluh/padi/get?limit=1`,
		`korluh/padi/get?kecamatan=${kecamatan}&tahun=${tahun}&bulan=${bulan}`,
		(url: string) =>
			axiosPrivate
				.get(url, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res: any) => res.data)
	);

	return (
		<div>
			{/* title */}
			<div className="text-xl md:text-2xl mb-4 font-semibold text-primary capitalize">
				Detail Korluh Padi
			</div>
			{/* title */}

			{/* Dekstop */}
			<div className="hidden md:block">
				<>
					{/* top */}
					<div className="lg:flex gap-2 lg:justify-start lg:items-center w-full mt-2 lg:mt-4">
						<Link href="/tanaman-pangan-holtikutura/validasi/padi" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
							Kembali
						</Link>
						<div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
						</div>
					</div>
					{/* top */}
				</>
				{/* bulan */}
				<div className="md:mt-2 mt-1 flex items-center gap-2">
					<div className="font-semibold">Bulan :</div>
					<div>
						{dataPadi?.data?.data[0]?.tanggal ? (
							new Date(dataPadi.data.data[0].tanggal).toLocaleDateString('id-ID', {
								month: 'long',
								year: 'numeric'
							})
						) : (
							"-"
						)}
					</div>
				</div>
				{/* bulan */}

				{/* kecamatan */}
				<div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
					<div className="flex items-center gap-2">
						<div className="font-semibold">Kecamatan :</div>
						<div>
							{dataPadi?.data?.data[0]?.kecamatan?.nama || "-"}
						</div>
					</div>
				</div>
				{/* kecamatan */}

			</div>
			{/* Dekstop */}

			{/* Mobile f*/}
			<div className="md:hidden">
				<>
					{/* top */}
					<div className="lg:flex gap-2 lg:justify-start lg:items-center w-full mt-2 lg:mt-4">
						<Link href="/tanaman-pangan-holtikutura/validasi/padi" className='bg-white px-6 md:text-base text-xs rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
							Kembali
						</Link>
						<div className="w-full mt-2 lg:mt-0 flex justify-end gap-2">
						</div>
					</div>
					{/* top */}
				</>
				{/* bulan */}
				<div className="card-table text-xs p-4 rounded-2xl border border-primary bg-white shadow-sm mt-4">
					<div className="md:mt-2 mt-1 flex items-center gap-2">
						<div className="font-semibold">Bulan :</div>
						<div>
							{dataPadi?.data?.data[0]?.tanggal ? (
								new Date(dataPadi.data.data[0].tanggal).toLocaleDateString('id-ID', {
									month: 'long',
									year: 'numeric'
								})
							) : (
								"-"
							)}
						</div>
					</div>
					{/* bulan */}

					{/* kecamatan */}
					<div className="wrap mt-2 flex flex-col md:gap-2 gap-1">
						<div className="flex items-center gap-2">
							<div className="font-semibold">Kecamatan :</div>
							<div>
								{dataPadi?.data?.data[0]?.kecamatan?.nama || "-"}
							</div>
						</div>
					</div>
					{/* kecamatan */}
				</div>
			</div>
			{/* Mobile f*/}


			{/* mobile accordion */}
			<div className="md:hidden">
				<Accordion type="single" collapsible className="w-full">
					{dataPadi?.data.data && dataPadi.data.data.length > 0 ? (
						dataPadi.data.data.map((item, index) => (
							<AccordionItem className="mt-2" value={`${index}`} key={item.id || index}>
								<AccordionTrigger className="border border-primary p-3 rounded-lg text-sm">
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
								</AccordionTrigger>
								<AccordionContent className="border border-primary p-3 rounded-lg mt-1">
									<div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
										<div className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
											<div className="wrap-konten flex flex-col gap-2">
												<Carousel>
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
										</div>
									</div >
								</AccordionContent>
							</AccordionItem>
						))
					) : (
						<div className="text-center">
							<NotFoundSearch />
						</div>
					)}
				</Accordion>
			</div>
			{/* accordion mobile */}

			{/* desktop accordion */}
			<div className="hidden md:block">
				<Accordion type="single" collapsible className="w-full">
					{dataPadi?.data.data && dataPadi.data.data.length > 0 ? (
						dataPadi.data.data.map((item, index) => (
							<AccordionItem className="mt-2" value={`${index}`} key={item.id || index}>
								<AccordionTrigger className="border border-primary p-3 rounded-lg">
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
								</AccordionTrigger>
								<AccordionContent className="border border-primary p-3 rounded-lg mt-1">
									<div className="hidden md:block">
										<Table className="border border-slate-200 mt-1">
											<TableHeader className="bg-primary-600">
												<TableRow>
													<TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
														No
													</TableHead>
													<TableHead rowSpan={2} className="text-primary border border-slate-200 text-center py-1">
														Uraian
													</TableHead>
													<TableHead colSpan={3} className="text-primary border border-slate-200 text-center py-1">
														Lahan Sawah
													</TableHead>
													<TableHead colSpan={3} className="text-primary border border-slate-200 text-center py-1">
														Lahan Bukan Sawah
													</TableHead>
												</TableRow>
												<TableRow>
													<TableHead className="text-primary border border-slate-200 text-center py-1">Panen</TableHead>
													<TableHead className="text-primary border border-slate-200 text-center py-1">Tanam</TableHead>
													<TableHead className="text-primary border border-slate-200 text-center py-1">Puso</TableHead>
													<TableHead className="text-primary border border-slate-200 text-center py-1">Panen</TableHead>
													<TableHead className="text-primary border border-slate-200 text-center py-1">Tanam</TableHead>
													<TableHead className="text-primary border border-slate-200 text-center py-1">Puso</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
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
											</TableBody>
										</Table>
									</div>
								</AccordionContent>
							</AccordionItem>
						))
					) : (
						<div className="text-center">
							<NotFoundSearch />
						</div>
					)}
				</Accordion>
			</div>
			{/* accordion desktop */}

		</div>
	);
};

export default KorlubPadiDetail;
