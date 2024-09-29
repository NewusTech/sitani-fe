"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Dashboard from "../../../public/icons/Dashboard";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import CloseNav from "../../../public/icons/CloseNav";
import OpenNav from "../../../public/icons/OpenNav";
import LogoutDashboard from "../../../public/icons/Logout";
import { Badge } from "@/components/ui/badge";
import ComponentWithAccess from "@/components/auth/componentWithAccess";
import { PERMISSIONS } from "@/utils/permissions";
import Swal from 'sweetalert2';

interface LayoutAdminProps {
	children: React.ReactNode;
	title?: string;
}

interface MenuProps {
	icons?: React.ReactNode;
	children: React.ReactNode;
	title?: string;
	link: string;
}

const Menu = (props: MenuProps) => {
	const pathname = usePathname();
	return (
		<Link
			href={props.link}
			className={`nav hover:pl-[15px] transition-all duration-150 flex items-center gap-4 text-left rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(props.link) ? "text-primary" : "text-black"
				}`}
		>
			<div className="icon">{props.icons}</div>
			<div
				className={`nama text-[18px] ${pathname.startsWith(props.link)
					? "text-primary font-semibold"
					: "text-black/70"
					}`}
			>
				{props.children}
			</div>
		</Link>
	);
};

interface LayProps {
	link?: string;
}

const LayoutAdmin = (props: LayoutAdminProps) => {
	const router = useRouter();

	const handleLogout = () => {
		// Menghapus semua item di localStorage
		localStorage.clear();

		// Tampilkan pop-up sukses tanpa tombol OK, otomatis menghilang setelah 2 detik
		Swal.fire({
			title: 'Logout Berhasil',
			text: 'Anda akan diarahkan ke halaman login.',
			icon: 'success',
			timer: 2000,  // Pop-up akan otomatis tertutup setelah 2 detik
			timerProgressBar: true,  // Menampilkan progress bar waktu
			showConfirmButton: false,  // Tidak menampilkan tombol OK
		}).then(() => {
			// Arahkan ke halaman login setelah pop-up ditutup otomatis
			router.push('/login');
		});
	};
	const [navbar, setNavbar] = useState(false);

	const pathname = usePathname();
	const isProdukActive =
		pathname.startsWith("/admin/cms/kategori") ||
		pathname.startsWith("/admin/cms/unit");
	const [produk, setProduk] = useState(isProdukActive);

	const handleProduk = () => {
		setProduk(!produk);
	};

	const handleNavbar = () => {
		setNavbar(!navbar);
	};
	const handleDropdownOpen = (route: string) => {
		setIsDropdownOpen(isDropdownOpen === route ? null : route);
	};

	const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
	return (
		<div className="wrap w-full min-h-screen bg-white relative">
			{/* navbar */}
			<div className="navatas lg:px-0 top-0 w-full md:w-full right-0 fixed md:bg-transparent bg-white py-4 pr-5 pl-5 md:-z-30 z-10">
				<div className="wra white -z-10 md:ml-[290px] bg-transparent m-auto justify-between lg:justify-end md:py-[23px] flex items-center gap-4 text-left">
					<div className="teks flex-shrink-0 text-primary animate-pulse transition-all">
						<div className="head font-bold text-lg text-primary">
							SITANI
						</div>
						<div className="head text-sm">Super Admin</div>
					</div>
					<div
						onClick={handleNavbar}
						className="icon  flex cursor-pointer lg:hidden bg-primary rounded p-2 w-[40px] justify-center items-center px-2 text-white "
					>
						{navbar ? <CloseNav /> : <OpenNav />}
					</div>
				</div>
			</div>
			{/* sidebar */}
			<div
				className={`sidebar bg-[#F6F6F6] overflow-auto z-50 pt-[10px] lg:pt-0 lg:z-20 lg:block h-screen fixed top-0 ${navbar ? "left-[0%]" : "left-[-100%]"
					} box-border lg:w-[300px] lg:shadow-none shadow-lg w-[75%] px-[30px] bg-whie transition-all duration-300 lg:left-0 `}
			>
				<div className="LOGO flex my-5 md:my-10 gap-2 items-center ">
					<div className="logo flex-shrink-0 ">
						<Image
							src="/assets/images/logo.png"
							alt="logo"
							width={100}
							height={100}
							unoptimized
							className="w-[50px]"
						/>
					</div>
					<div className="teks flex-shrink-0 text-primary">
						<div className="head font-bold text-2xl text-primary animate-pulse transition-all">
							SITANI
						</div>
						<div className="head text-base ">Super Admin</div>
					</div>
				</div>
				<div className="wrap-nav flex bg-red flex-col gap-2 mb-10">
					<div className="wrap flex flex-col gap-1">
						<div className="h-[73%] overflow-auto ">
							{/* dashboard */}
							<ComponentWithAccess
								allowPermissions={[
									PERMISSIONS.semua,
								]}
							>
								<Link
									href="/dashboard"
									className={`nav flex pr-4 text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] ${pathname.startsWith("/dashboard")
										? "bg-primary text-white"
										: "bg-transparent text-primary"
										}`}
								>
									<Dashboard />
									Dashboard
								</Link>
							</ComponentWithAccess>
							{/* dashboard */}
							<Accordion className="" type="single" collapsible>
								{/* ketahanan-pangan */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.kepangHargaProdusen,
										...PERMISSIONS.kepangKoefisienProduksi,
										...PERMISSIONS.kepangKoefisienProdusen,
										...PERMISSIONS.kepangKuisioner,
										...PERMISSIONS.kepangPerbandingaKomoditas,
									]}
								>
									<AccordionItem className="pl-2" value="item-1">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(
												"/ketahanan-pangan"
											)
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Ketahanan Pangan
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/ketahanan-pangan/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/ketahanan-pangan/produsen-dan-eceran">
												<span className="text-sm">
													Harga Produsen & Eceran{" "}
												</span>
											</Menu>
											<Menu link="/ketahanan-pangan/harga-pangan-eceran">
												<span className="text-sm">
													Perbandingan Komoditas Harga
													Panen
												</span>
											</Menu>
											<Menu link="/ketahanan-pangan/kuisioner-pedagang-eceran">
												<span className="text-sm">
													Kuesioner Pedagang Eceran
												</span>
											</Menu>
											<Menu link="/ketahanan-pangan/koefisien-variasi-produsen">
												<span className="text-sm">
													Koefisien Variasi Produsen
												</span>
											</Menu>
											<Menu link="/ketahanan-pangan/koefisien-variasi-produksi">
												<span className="text-sm">
													Koefisien Variasi Produksi
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/* ketahanan-pangan */}
								{/* tanaman-pangan */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.thpLahanBukanSawah,
										...PERMISSIONS.thpLahanSawah,
										...PERMISSIONS.thpRealisasiPadi,
										...PERMISSIONS.thpRealisasiPalawija1,
										...PERMISSIONS.thpRealisasiPalawija2,
									]}
								>
									<AccordionItem className="pl-2" value="item-2">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(
												"/tanaman-pangan-holtikutura"
											)
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Tanaman Pangan dan Holtikulturan
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/tanaman-pangan-holtikutura/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/tanaman-pangan-holtikutura/realisasi">
												<span className="text-sm">
													Realisasi
												</span>
											</Menu>
											<Menu link="/tanaman-pangan-holtikutura/lahan">
												<span className="text-sm">
													Lahan
												</span>
											</Menu>
											{/*  */}
											<div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse mb-2"></div>
											<div className="flex px-[25px] font-bold text-primary text-base">Validasi Korluh</div>
											<Menu link="/tanaman-pangan-holtikutura/validasi/padi">
												<span className="text-sm">
													Padi
												</span>
											</Menu>
											<Menu link="/tanaman-pangan-holtikutura/validasi/palawija">
												<span className="text-sm">
													Palawija
												</span>
											</Menu>
											<Menu link="/tanaman-pangan-holtikutura/validasi/sayuran-buah">
												<span className="text-sm">
													Sayuran dan Buah
												</span>
											</Menu>
											<Menu link="/tanaman-pangan-holtikutura/validasi/tanaman-hias">
												<span className="text-sm">
													Tanaman Hias
												</span>
											</Menu>
											<Menu link="/tanaman-pangan-holtikutura/validasi/tanaman-biofarmaka">
												<span className="text-sm">
													Tanaman Biofarmaka
												</span>
											</Menu>
											{/*  */}
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/* tanaman-pangan */}
								{/* perkebunan */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.perkebunanKabupaten,
										...PERMISSIONS.perkebunanKecamatan,
									]}
								>
									<AccordionItem className="pl-2" value="item-3">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith("/perkebunan")
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Perkebunan
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/perkebunan/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/perkebunan/luas-produksi-kecamatan">
												<span className="text-sm">
													Luas & Produksi PR (Kec)
												</span>
											</Menu>
											<Menu link="/perkebunan/luas-produksi-kabupaten">
												<span className="text-sm">
													Luas & Produksi PR (Kab)
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/* perkebunan */}
								{/* penyuluhan */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.penyuluhKabupaten,
										...PERMISSIONS.penyuluhKecamatan,
									]}
								>
									<AccordionItem className="pl-2" value="item-4">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith("/penyuluhan")
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Penyuluhan
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/penyuluhan/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/penyuluhan/data-kabupaten">
												<span className="text-sm">
													Data Kabupaten
												</span>
											</Menu>
											<Menu link="/penyuluhan/data-kecamatan">
												<span className="text-sm">
													Data Kecamatan
												</span>
											</Menu>
											<Menu link="/penyuluhan/data-poktan">
												<span className="text-sm">
													Data Poktan
												</span>
											</Menu>
											<Menu link="/penyuluhan/data-gapoktan">
												<span className="text-sm">
													Data Gapoktan
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/* penyuluhan */}
								{/* PSP */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.pspBantuan,
										...PERMISSIONS.pspPupuk,
										...PERMISSIONS.pspUPPO,

									]}
								>
									<AccordionItem className="pl-2" value="item-5">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith("/psp")
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											PSP
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/psp/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/psp/data-penerima-uppo">
												<span className="text-sm">
													Data Penerima UPPO
												</span>
											</Menu>
											<Menu link="/psp/pupuk">
												<span className="text-sm">
													Pupuk
												</span>
											</Menu>
											<Menu link="/psp/bantuan">
												<span className="text-sm">
													Bantuan
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/* PSP */}
								{/* kepegawaian */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.kepegawaian,
									]}
								>
									<AccordionItem className="pl-2" value="item-6">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith("/kepegawaian/")
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Kepegawaian
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/kepegawaian/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/kepegawaian/data-pegawai">
												<span className="text-sm">
													Data Pegawai
												</span>
											</Menu>
											<Menu link="/kepegawaian/tambah-pegawai">
												<span className="text-sm">
													Tambah Pegawai
												</span>
											</Menu>
											<Menu link="/kepegawaian/data-pensiun">
												<span className="text-sm">
													Data Pensiun
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/* kepegawaian */}
								{/* KJF Kecamatan */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.kabupatenPadi,
										...PERMISSIONS.kabupatenPalawija,
										...PERMISSIONS.kabupatenSayurBuah,
										...PERMISSIONS.kabupatenTanamanBiofarmaka,
										...PERMISSIONS.kabupatenTanamanHias,
									]}
								>
									<AccordionItem className="pl-2" value="item-8">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(
												"/kjf-kabupaten"
											)
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											KJF Kabupaten
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/kjf-kabupaten/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/kjf-kabupaten/padi">
												<span className="text-sm">
													Padi
												</span>
											</Menu>
											<Menu link="/kjf-kabupaten/palawija">
												<span className="text-sm">
													Palawija
												</span>
											</Menu>
											<Menu link="/kjf-kabupaten/sayuran-buah">
												<span className="text-sm">
													Sayuran dan Buah
												</span>
											</Menu>
											<Menu link="/kjf-kabupaten/tanaman-hias">
												<span className="text-sm">
													Tanaman Hias
												</span>
											</Menu>
											<Menu link="/kjf-kabupaten/tanaman-biofarmaka">
												<span className="text-sm">
													Tanaman Biofarmaka
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/*bpp kecamatan */}
								{/* bpp kecamatan */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.kecamatanPadi,
										...PERMISSIONS.kecamatanPalawija,
										...PERMISSIONS.kecamatanSayurBuah,
										...PERMISSIONS.kecamatanTanamanBiofarmaka,
										...PERMISSIONS.kecamatanTanamanHias,

									]}
								>
									<AccordionItem className="pl-2" value="item-9">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(
												"/bpp-kecamatan"
											)
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											BPP Kecamatan
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/bpp-kecamatan/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/bpp-kecamatan/padi">
												<span className="text-sm">
													Padi
												</span>
											</Menu>
											<Menu link="/bpp-kecamatan/palawija">
												<span className="text-sm">
													Palawija
												</span>
											</Menu>
											<Menu link="/bpp-kecamatan/sayuran-buah">
												<span className="text-sm">
													Sayuran dan Buah
												</span>
											</Menu>
											<Menu link="/bpp-kecamatan/tanaman-hias">
												<span className="text-sm">
													Tanaman Hias
												</span>
											</Menu>
											<Menu link="/bpp-kecamatan/tanaman-biofarmaka">
												<span className="text-sm">
													Tanaman Biofarmaka
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/*bpp kecamatan */}
								{/* korluh */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.korluhPadi,
										...PERMISSIONS.korluhPalawija,
										...PERMISSIONS.korluhSayurBuah,
										...PERMISSIONS.korluhTanamanHias,
										...PERMISSIONS.korluhTanamanBiofarmaka,
									]}
								>
									<AccordionItem
										className="pl-2"
										value="item-10"
									>
										<ComponentWithAccess
											allowPermissions={[
												PERMISSIONS.semua,
												...PERMISSIONS.korluhPadi,
											]}
										>
											<AccordionTrigger
												className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(
													"/korluh"
												)
													? "bg-primary text-white"
													: "bg-transparent text-primary"
													}`}
											>
												Korluh
											</AccordionTrigger>
										</ComponentWithAccess>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/korluh/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/korluh/padi">
												<span className="text-sm">
													Padi
												</span>
											</Menu>
											<Menu link="/korluh/palawija">
												<span className="text-sm">
													Palawija
												</span>
											</Menu>
											<Menu link="/korluh/sayuran-buah">
												<span className="text-sm">
													Sayuran dan Buah
												</span>
											</Menu>
											<Menu link="/korluh/tanaman-hias">
												<span className="text-sm">
													Tanaman Hias
												</span>
											</Menu>
											<Menu link="/korluh/tanaman-biofarmaka">
												<span className="text-sm">
													Tanaman Biofarmaka
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/*korluh */}
								{/* data-master */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.masterBerita,
										...PERMISSIONS.masterGaleri,

									]}
								>
									<AccordionItem className="pl-2" value="item-11">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith("/data-master")
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Data Master
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/data-master/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/data-master/kelola-berita">
												<span className="text-sm">
													Kelola Berita
												</span>
											</Menu>
											<Menu link="/data-master/kelola-galeri">
												<span className="text-sm">
													Kelola Galeri
												</span>
											</Menu>
											<Menu link="/data-master/kelola-bidang">
												<span className="text-sm">
													Kelola Bidang
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/*data-master */}
								{/* peran-pengguna */}
								<ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										...PERMISSIONS.pengguna,
									]}
								>
									<AccordionItem className="pl-2" value="item-7">
										<AccordionTrigger
											className={`nav flex items-center gap-4 text-left mb-2 rounded-[8px] py-[10px] px-[10px] ${pathname.startsWith(
												"/peran-pengguna"
											)
												? "bg-primary text-white"
												: "bg-transparent text-primary"
												}`}
										>
											Peran Pengguna
										</AccordionTrigger>
										<AccordionContent className="bg-primary-600/25 mb-2 rounded-md">
											<Menu link="/peran-pengguna/overview">
												<span className="text-sm">
													Overview
												</span>
											</Menu>
											<Menu link="/peran-pengguna/peran">
												<span className="text-sm">
													Peran
												</span>
											</Menu>
											<Menu link="/peran-pengguna/pengguna">
												<span className="text-sm">
													Pengguna
												</span>
											</Menu>
										</AccordionContent>
									</AccordionItem>
								</ComponentWithAccess>
								{/*peran-pengguna */}
								{/* Status Laporan */}
								{/* <ComponentWithAccess
									allowPermissions={[
										PERMISSIONS.semua,
										PERMISSIONS.semua,
										...PERMISSIONS.korluhPadi,
										...PERMISSIONS.korluhPalawija,
										...PERMISSIONS.korluhSayurBuah,
										...PERMISSIONS.korluhTanamanHias,
										...PERMISSIONS.korluhTanamanBiofarmaka,
										// 
										...PERMISSIONS.kecamatanPadi,
										...PERMISSIONS.kecamatanPalawija,
										...PERMISSIONS.kecamatanSayurBuah,
										...PERMISSIONS.kecamatanTanamanBiofarmaka,
										...PERMISSIONS.kecamatanTanamanHias,
										// 
										...PERMISSIONS.kabupatenPadi,
										...PERMISSIONS.kabupatenPalawija,
										...PERMISSIONS.kabupatenSayurBuah,
										...PERMISSIONS.kabupatenTanamanBiofarmaka,
										...PERMISSIONS.kabupatenTanamanHias,
									]}
								>
									<Link
										href="/status-laporan"
										className={`nav flex pr-4 text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] justify-between ${pathname.startsWith("/status-laporan")
											? "bg-primary text-white"
											: "bg-transparent text-primary"
											}`}
									>
										<span>Status Laporan</span>
										<Badge variant="destructive">2</Badge>
									</Link>
								</ComponentWithAccess> */}
								{/*status laporan */}
							</Accordion>
							<button
								onClick={handleLogout}
								className="nav flex pr-4 w-[95%] text-[16px] font-medium items-center gap-4 mb-2 rounded-[8px] py-[10px] ml-[6px] px-[10px] text-primary hover:text-white bg-transparent hover:bg-primary ease-in duration-150 mt-1"
							>
								<LogoutDashboard />
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* KONTEN */}
			<div className="konten z-10 lg:px-0 px-[10px] lg:mr-[20px] lg:ml-[320px] md:pt-[15px] pt-[70px] h-full">
				<div className="konten overflow-auto h-[90%] p-3 lg:px-1">
					{/* konten */}
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default LayoutAdmin;
