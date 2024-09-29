"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import Emailicon from "../../../../public/icons/EmailIcon";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HelperError from "@/components/ui/HelperError";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { axiosInstance } from "@/utils/axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import { PERMISSIONS } from "@/utils/permissions";

const formSchema = z.object({
	email: z
		.string()
		.min(1, { message: "Email wajib diisi" })
		.email({ message: "Alamat email tidak valid" }),
	password: z
		.string()
		.min(6, { message: "Password wajib diisi minimal harus 6 karakter" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Login = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormSchemaType>({
		resolver: zodResolver(formSchema),
	});

	const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
	const [permissions, setPermissions] = useLocalStorage("permissions", "");
	const [user, setUser] = useLocalStorage("user", "");

	const [loginError, setLoginError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onSubmit = async (data: FormSchemaType) => {
		setLoading(true); // Set loading to true when the form is submitted
		setLoginError(null); // Reset any previous errors
		await new Promise((resolve) => setTimeout(resolve, 3000));

		try {
			const response = await axiosInstance.post("/login", {
				email_or_nip: data.email,
				password: data.password,
			});

			// DELETE in PROD
			console.log("RESPONSE", response);

			if (response.status === 200) {
				console.log("BERHASIL");
				setAccessToken(response?.data?.data?.access_token);
				setPermissions(response?.data?.data?.permissions);
				setUser(response?.data?.data?.user);
				reset();
				// alert
				Swal.fire({
					icon: "success",
					title: "Berhasil Login!",
					text: "Selamat Datang ✅",
					timer: 3000,
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
				const temp = response?.data?.data?.permissions;
				if (Array.isArray(temp)) {
					if (temp.includes(PERMISSIONS.semua)) {
						router.push("/dashboard"); // Ganti dengan rute tujuan setelah login
					} else {
						for (let i of temp) {
							if (
								[
									...PERMISSIONS.kepangHargaProdusen,
									...PERMISSIONS.kepangKoefisienProduksi,
									...PERMISSIONS.kepangKoefisienProdusen,
									...PERMISSIONS.kepangKuisioner,
									...PERMISSIONS.kepangPerbandingaKomoditas,
								].includes(i)
							) {
								router.push("/ketahanan-pangan/overview");
							} else if (
								[
									...PERMISSIONS.thpLahanBukanSawah,
									...PERMISSIONS.thpLahanSawah,
									...PERMISSIONS.thpRealisasiPadi,
									...PERMISSIONS.thpRealisasiPalawija1,
									...PERMISSIONS.thpRealisasiPalawija2,
								].includes(i)
							) {
								router.push(
									"/tanaman-pangan-holtikutura/overview"
								);
							} else if (
								[
									...PERMISSIONS.perkebunanKabupaten,
									...PERMISSIONS.perkebunanKecamatan,
								].includes(i)
							) {
								router.push("/perkebunan/overview");
							} else if (
								[
									...PERMISSIONS.penyuluhKabupaten,
									...PERMISSIONS.penyuluhKecamatan,
								].includes(i)
							) {
								router.push("/penyuluhan/overview");
							} else if (
								[
									...PERMISSIONS.pspBantuan,
									...PERMISSIONS.pspPupuk,
									...PERMISSIONS.pspUPPO,
								].includes(i)
							) {
								router.push("/psp/overview");
							} else if (
								[...PERMISSIONS.kepegawaian].includes(i)
							) {
								router.push("/kepegawaian/overview");
							} else if (
								[
									...PERMISSIONS.kabupatenPadi,
									...PERMISSIONS.kabupatenPalawija,
									...PERMISSIONS.kabupatenSayurBuah,
									...PERMISSIONS.kabupatenTanamanBiofarmaka,
									...PERMISSIONS.kabupatenTanamanHias,
								].includes(i)
							) {
								router.push("/kjf-kabupaten/overview");
							} else if (
								[
									...PERMISSIONS.kecamatanPadi,
									...PERMISSIONS.kecamatanPalawija,
									...PERMISSIONS.kecamatanSayurBuah,
									...PERMISSIONS.kecamatanTanamanBiofarmaka,
									...PERMISSIONS.kecamatanTanamanHias,
								].includes(i)
							) {
								router.push("/bpp-kecamatan/overview");
							} else if (
								[
									...PERMISSIONS.korluhPadi,
									...PERMISSIONS.korluhPalawija,
									...PERMISSIONS.korluhSayurBuah,
									...PERMISSIONS.korluhTanamanBiofarmaka,
									...PERMISSIONS.korluhTanamanHias,
								].includes(i)
							) {
								router.push("/korluh/overview");
							} else if (PERMISSIONS.masterBerita.includes(i)) {
								router.push("/data-master/kelola-berita");
							} else if (PERMISSIONS.masterGaleri.includes(i)) {
								router.push("/data-master/kelola-galeri");
							} else if (PERMISSIONS.pengguna.includes(i)) {
								router.push("/peran-pengguna/pengguna");
							}
						}
					}
				}
			} else {
				setAccessToken("");
				setPermissions("");
				setUser("");
				setLoginError(
					response?.data?.message || "Login gagal. Silakan coba lagi."
				);
			}
		} catch (error: any) {
			setAccessToken("");
			setPermissions("");
			setUser("");
			// router.push("/dashboard");
			// alert
			// Extract error message from API response
			const errorMessage =
				error.response?.data?.data?.[0]?.message ||
				"Gagal menambahkan data!";
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
			// alert
			// console.error('Error:', error);
			// setLoginError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<div className="grid flex-1 grid-cols-1 lg:grid-cols-[60%_minmax(40%,_1fr)]">
				{/* Background Image Section */}
				<div className="hidden lg:block">
					<Image
						src="/assets/images/bg-login.png"
						width={800}
						height={800}
						alt="SITANI | Sistem Informasi Data Pertanian Lampung Timur"
						className="h-screen w-full object-cover"
					/>
				</div>

				{/* Login Form Section */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex items-center justify-center"
				>
					<div className="w-full">
						<div className="left container mx-auto py-2 flex items-center gap-2">
							<div className="logo">
								<Image
									src="/assets/images/logo.png"
									alt="logo"
									width={100}
									height={100}
									unoptimized
									className="w-[50px]"
								/>
							</div>
							<div className="teks">
								<div className="head font-bold text-xl md:text-3xl text-primary animate-pulse transition-all">
									SITANI
								</div>
								<div className="head text-sm md:text-base">
									Sistem Informasi Data Pertanian Lampung
									Timur
								</div>
							</div>
						</div>
						<div className="m-5 pl-5 pr-5 pt-5 pb-5 lg:pb-0 lg:pt-0  md:border-none lg:border-none border-2 border-primary rounded-lg ">
							<h1 className="text-xl lg:text-[24px] mb-5 md:mb-5 text-primary font-semibold text-left">
								Silahkan Masuk
							</h1>
							<div className="flex flex-col mb-2">
								<Label
									className="text-[14px] pb-1"
									label="Email / NIP"
								/>
								<Input
									autoFocus
									leftIcon={<Emailicon />}
									type="email"
									placeholder="Email / NIP"
									{...register("email")}
									className={`${errors.email ? "border-red-500" : ""
										}`}
								/>
								{errors.email && (
									<HelperError>
										{errors.email.message}
									</HelperError>
								)}
							</div>

							<div className="flex flex-col">
								<Label
									className="text-[14px] pb-1"
									label="Password"
								/>
								<Input
									type="password"
									placeholder="Kata Sandi"
									{...register("password")}
									className={`${errors.password ? "border-red-500" : ""
										}`}
								/>
								{errors.password && (
									<HelperError>
										{errors.password.message}
									</HelperError>
								)}
							</div>

							{loginError && (
								<div className="text-red-500 mt-2">
									{loginError}
								</div>
							)}

							<div className="text-left underline mt-2">
								<Link
									href="/admin/forget-password"
									className="text-primary text-[14px]"
								>
									Lupa kata sandi?
								</Link>
							</div>
							<div className="mt-5 text-center">
								<Button
									type="submit"
									variant="primary"
									size="lg"
									className="w-full"
									disabled={loading} // Disable button during loading
								>
									{loading ? (
										<span className="flex items-center justify-center animate-pulse transition-all">
											<svg
												className="animate-spin h-5 w-5 mr-3 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Tunggu...
										</span>
									) : (
										"Masuk"
									)}
								</Button>
							</div>
							{/* <div className="mt-5 text-center w-full">
                <Link href="/dashboard" className="block w-full p-2 text-white bg-primary rounded-full">
                  Masuk
                </Link>
              </div>
            </div>
            {/* Footer Section */}
							<div className="text-[14px] lg:text-sm bottom-0 left-0 right-0 flex justify-center text-primary gap-1 py-2 bg-white animate-pulse transition-all">
								<span>copyright 2024</span>
								<span className="">&copy;</span>
								<span className="">SITANI</span>
								<span>Lampung Timur</span>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
