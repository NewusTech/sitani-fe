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
import { format } from "date-fns";
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
			<div className="text-2xl mb-5 font-semibold text-primary uppercase">
				Korluh Padi
			</div>
			{/* title */}

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
										"w-full justify-start text-left font-normal text-[14px] md:text-[11px] lg:text-sm",
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
							<Button
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
							</Button>
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
							href="/korluh/padi/tambah"
							className="bg-primary px-3 md:px-8 py-2 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-base mb-3"
						>
							Tambah
						</Link>
					</ComponentWithAccess>
				</div>
			</div>
			{/* top */}
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
				<div className="flex items-center gap-2">
					<div className="font-semibold">Desa:</div>
					{dataPadi?.data?.data.map((item, index) => (
						<div key={index}>
							{item?.desa.nama || "Tidak ada data"}
						</div>
					))}
				</div>
			</div>
			{/* kecamatan */}

			{/*table mobile */}
			<div className="mobile  block md:hidden sm:hidden lg:hidden">
				<div className="garis my-2 mb-3 h-[1px] w-full bg-slate-400"></div>
				{dataPadi?.data?.data.map((item, index) => (
					<div
						key={item.id}
						className="flex items-center gap-4 justify-end"
					>
						<Link href={`/korluh/padi/detail/${item.id}`}>
							<EyeIcon />
						</Link>
						<ComponentWithAccess
							allowPermissions={[
								PERMISSIONS.semua,
								PERMISSIONS.korluhPadi[2],
							]}
						>
							<Link href={`/korluh/padi/edit/${item.id}`}>
								<EditIcon />
							</Link>
						</ComponentWithAccess>
						<ComponentWithAccess
							allowPermissions={[
								PERMISSIONS.semua,
								PERMISSIONS.korluhPadi[3],
							]}
						>
							<DeletePopup
								onDelete={() => handleDelete(String(item.id))}
							/>
						</ComponentWithAccess>
					</div>
				))}
				<KorluhPadiMobileComp
					urlApi={`korluh/padi/get?page=${currentPage}&search=${search}&limit=1&equalDate=${filterDate}`}
				/>
			</div>
			{/*table mobile */}

			{/* table */}
			<div className="tabel-wrap hidden sm:block md:block lg:block">
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
									Tidak ada data
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
