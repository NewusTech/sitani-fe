"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import SearchIcon from "../../../../../../../public/icons/SearchIcon";
import { Button } from "@/components/ui/button";
import UnduhIcon from "../../../../../../../public/icons/UnduhIcon";
import PrintIcon from "../../../../../../../public/icons/PrintIcon";
import FilterIcon from "../../../../../../../public/icons/FilterIcon";
import Link from "next/link";
import EditIcon from "../../../../../../../public/icons/EditIcon";
import EyeIcon from "../../../../../../../public/icons/EyeIcon";

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
import TambahIcon from "../../../../../../../public/icons/TambahIcon";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { useSearchParams } from 'next/navigation';


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

	const searchParams = useSearchParams();

	// Ambil query parameters dari URL
	const kecamatan = searchParams.get('kecamatan');
	const tahun = searchParams.get('tahun');
	const bulan = searchParams.get('bulan');

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
				Korluh Padi
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
						</div>

					</div>

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


			{/* accordion */}
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

			{/* accordion */}

		</div>
	);
};

export default KorlubPadiDetail;
