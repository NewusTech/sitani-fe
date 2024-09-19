"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
// 
import Swal from 'sweetalert2';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { mutate, SWRResponse } from "swr";
import useLocalStorage from '@/hooks/useLocalStorage';
import Loading from '@/components/ui/Loading';
import InputComponent from '@/components/ui/InputKecDesa';

const formSchema = z.object({
    kecamatan_id: z
        .number()
        .min(1, "Kecamatan wajib diisi")
        .transform((value) => Number(value)), // Convert string to number
    tahun: z
        .string()
        .min(1, { message: "Tahun wajib diisi" }),
    master_kategori_komoditas_id: z
        .string()
        .min(1, { message: "Kategori wajib diisi" }),
    master_komoditas_id: z
        .string()
        .min(1, { message: "master_komoditas_id wajib diisi" }),
    tbm: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    tm: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    tr: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    produksi: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    produktivitas: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    jml_petani_pekebun: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    bentuk_hasil: z
        .string()
        .min(0, { message: "Bentuk Hasil wajib diisi" }),
    keterangan: z
        .string()
        .min(0, { message: "Keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahKecPage = () => {
    const [date, setDate] = React.useState<Date>()
    // GET ALL MASTER KATEGORI
    interface Kategori {
        id: number;
        nama: string;
    }

    interface ResponseKategori {
        status: string;
        data: Kategori[];
        message: string;
    }
    interface Komoditi {
        id: number;
        nama: string;
        perkebunanMasterKategoriId: number;
    }

    interface ResponseKomoditi {
        status: string;
        data: Komoditi[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKategori }: SWRResponse<ResponseKategori> = useSWR(
        `/perkebunan/master-kategori/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET ALL KATEGORI
    // GET ALL KOMODITAS
    const { data: dataKomoditi }: SWRResponse<ResponseKomoditi> = useSWR(
        `/perkebunan/master-komoditas/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
        setValue
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });
    // get master
    const selectedKategori = Number(watch("master_kategori_komoditas_id")); // Ensure conversion to number

    const kategoriOptions = dataKategori?.data.map(kategori => ({
        id: kategori.id.toString(),
        name: kategori.nama,
    }));

    const komoditiOptions = dataKomoditi?.data
        .filter(komoditi => komoditi.perkebunanMasterKategoriId === selectedKategori) // Ensure types match here
        .map(komoditi => ({
            id: komoditi.id.toString(),
            name: komoditi.nama,
        }));
    // get master
    // TAMBAH
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            setLoading(true);
            await axiosPrivate.post("/perkebunan/kecamatan/create", data);
            console.log(data)
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditambahkan!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
            // push
            navigate.push('/perkebunan/luas-produksi-kecamatan');
            console.log("Success to create user:");
            reset()
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menambahkan data!';
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: errorMessage,
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.error("Failed to create user:", error);
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/perkebunan/kecamatan/get`);
    };
    // TAMBAH

    return (
        <>
            <div className="text-primary md:text-2xl text-xl font-bold mb-5">Tambah Data Luas Produksi Kecamatan</div>
            {/* Nama NIP Tempat Tanggal Lahir */}
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
                <div className="wrap-form">
                    {/* pilih kecamatan - katagori panen */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                                <Controller
                                    name="kecamatan_id"
                                    control={control}
                                    render={({ field }) => (
                                        <KecValue
                                            // kecamatanItems={kecamatanItems}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.kecamatan_id && (
                                    <p className="text-red-500">{errors.kecamatan_id.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Tahun" />
                                <Input
                                    type="number"
                                    placeholder="Tahun"
                                    {...register('tahun')}
                                    className={`${errors.tahun ? 'border-red-500' : ''}`}
                                />
                                {errors.tahun && (
                                    <HelperError>{errors.tahun.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* pilih master_komoditas_id */}
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Kategori Panen" />
                                <Controller
                                    name="master_kategori_komoditas_id"
                                    control={control}
                                    render={({ field }) => (
                                        <InputComponent
                                            typeInput="selectSearch"
                                            placeholder="Pilih Kategori"
                                            label="Kategori"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={kategoriOptions}
                                        />
                                    )}
                                />
                                {errors.master_kategori_komoditas_id && (
                                    <HelperError>{errors.master_kategori_komoditas_id.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2  w-full">
                                <Label className='text-sm mb-1' label="Pilih Komoditi" />
                                <Controller
                                    name="master_komoditas_id"
                                    control={control}
                                    render={({ field }) => (
                                        <InputComponent
                                            typeInput="selectSearch"
                                            placeholder="Pilih Komoditi"
                                            label="Komoditi"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={komoditiOptions}
                                        />
                                    )}
                                />
                                {errors.master_komoditas_id && (
                                    <HelperError>{errors.master_komoditas_id.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="wrap">
                        <div className="text-primary text-xl font-bold my-2">
                            Komposisi Luas Areal
                        </div>
                        {/* tbm - tm */}
                        <div className="mb-2">
                            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Tanaman Belum Menghasilkan" />
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Tanaman Belum Menghasilkan"
                                        {...register('tbm')}
                                        className={`${errors.tbm ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tbm && (
                                        <HelperError>{errors.tbm.message}</HelperError>
                                    )}
                                </div>
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Tanaman Menghasilkan" />
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Tanaman Menghasilkan"
                                        {...register('tm')}
                                        className={`${errors.tm ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tm && (
                                        <HelperError>{errors.tm.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* tr */}
                        <div className="mb-2">
                            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 md:w-1/2 w-full md:pr-3">
                                    <Label className='text-sm mb-1' label="Tanaman Rusak" />
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Tanaman Rusak"
                                        {...register('tr')}
                                        className={`${errors.tr ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tr && (
                                        <HelperError>{errors.tr.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* produksi - produktivitas */}
                        <div className="mb-2 mt-4">
                            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Produksi (TON)" />
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Produksi (TON)"
                                        {...register('produksi')}
                                        className={`${errors.produksi ? 'border-red-500' : ''}`}
                                    />
                                    {errors.produksi && (
                                        <HelperError>{errors.produksi.message}</HelperError>
                                    )}
                                </div>
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Produktivitas (Kg/Ha)" />
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Produktivitas (Kg/Ha)"
                                        {...register('produktivitas')}
                                        className={`${errors.produktivitas ? 'border-red-500' : ''}`}
                                    />
                                    {errors.produktivitas && (
                                        <HelperError>{errors.produktivitas.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* jumlah petani - bentuk hasil */}
                        <div className="mb-2">
                            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Jumlah Petani Perkebun" />
                                    <Input
                                        type="number"
                                        step="0.001"
                                        placeholder="Jumlah Petani Perkebun"
                                        {...register('jml_petani_pekebun')}
                                        className={`${errors.jml_petani_pekebun ? 'border-red-500' : ''}`}
                                    />
                                    {errors.jml_petani_pekebun && (
                                        <HelperError>{errors.jml_petani_pekebun.message}</HelperError>
                                    )}
                                </div>
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Bentuk Hasil" />
                                    <Input
                                        type="text"
                                        placeholder="Bentuk Hasil"
                                        {...register('bentuk_hasil')}
                                        className={`${errors.bentuk_hasil ? 'border-red-500' : ''}`}
                                    />
                                    {errors.bentuk_hasil && (
                                        <HelperError>{errors.bentuk_hasil.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* keterangan */}
                        <div className="mb-2">
                            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 md:w-1/2 w-full md:pr-3">
                                    <Label className='text-sm mb-1' label="Keterangan" />
                                    <Input
                                        type="text"
                                        placeholder="Keterangan"
                                        {...register('keterangan')}
                                        className={`${errors.keterangan ? 'border-red-500' : ''}`}
                                    />
                                    {errors.keterangan && (
                                        <HelperError>{errors.keterangan.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Button */}
                <div className="flex justify-end gap-3">
                    <Link href="/perkebunan/luas-produksi-kecamatan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Tambah"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TambahKecPage