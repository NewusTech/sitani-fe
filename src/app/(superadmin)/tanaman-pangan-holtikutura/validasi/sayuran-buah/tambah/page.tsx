"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';
import useLocalStorage from '@/hooks/useLocalStorage';
import InputComponent from '@/components/ui/InputKecDesa';

// Format tanggal yang diinginkan (yyyy-mm-dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

const formSchema = z.object({
    kecamatan_id: z
        .number()
        .min(1, "Kecamatan is required")
        .transform((value) => Number(value)), // Mengubah string menjadi number
    tanggal: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Tanggal wajib diisi" })),
    korluh_master_sayur_buah_id: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Sayuran dan buah wajib diisi" })),
    hasil_produksi: z
        .string().min(1, { message: "Hasil produksi wajib diisi" }),
    luas_panen_habis: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    luas_panen_belum_habis: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    luas_rusak: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    luas_penanaman_baru: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    produksi_habis: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    produksi_belum_habis: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    rerata_harga: z
        .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    keterangan: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahSayuranBuahKorluh = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const kecamatanValue = watch("kecamatan_id");


    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/korluh/sayur-buah/create", data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil di tambahkan!',
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
            console.log(data)
            // push
            navigate.push('/tanaman-pangan-holtikutura/validasi/sayuran-buah');
            console.log("Success to create Sayuran Buah:");
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
        mutate(`/korluh/sayur-buah/get`);
    };

    // 
    // GET ALL 
    interface Master {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Response {
        status: string;
        data: Master[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");

    const { data: dataMaster }: SWRResponse<Response> = useSWR(
        `/korluh/master-sayur-buah/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    const masterOptions = dataMaster?.data.map(master => ({
        id: master.id.toString(),
        name: master.nama,
    }))
    // 


    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-4">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-4">
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
                                <Label className='text-sm mb-1' label="Tanggal" />
                                <Input
                                    type="date"
                                    placeholder="Tanggal"
                                    {...register('tanggal')}
                                    className={`${errors.tanggal ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.tanggal && (
                                    <HelperError>{errors.tanggal.message}</HelperError>
                                )}
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama Tanaman" />
                                <Controller
                                    name="korluh_master_sayur_buah_id"
                                    control={control}
                                    render={({ field }) => (
                                        <InputComponent
                                            typeInput="selectSearch"
                                            placeholder="Pilih Sayuran dan Buah"
                                            label="Sayuran dan Buah"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={masterOptions}
                                        />
                                    )}
                                />
                                {errors.korluh_master_sayur_buah_id && (
                                    <HelperError>{errors.korluh_master_sayur_buah_id.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Hasil Produksi Yang Dicatat" />
                                <Input
                                    type="text"
                                    placeholder="Hasil Produksi Yang Dicatat"
                                    {...register('hasil_produksi')}
                                    className={`${errors.hasil_produksi ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.hasil_produksi && (
                                    <HelperError>{errors.hasil_produksi.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mb-4'>
                    <div className="text-primary text-lg font-bold mb-2">Luas Panen (Hektar)</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Habis/Dibongkar" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Habis / Dibongkar"
                                {...register('luas_panen_habis')}
                                className={`${errors.luas_panen_habis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luas_panen_habis && (
                                <HelperError>{errors.luas_panen_habis.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Belum Habis" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Belum Habis"
                                {...register('luas_panen_belum_habis')}
                                className={`${errors.luas_panen_belum_habis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luas_panen_belum_habis && (
                                <HelperError>{errors.luas_panen_belum_habis.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Luas Rusak / Tidak Berhasil / Puso (Hektar)" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Luas Rusak / Tidak Berhasil / Puso (Hektar)"
                                {...register('luas_rusak')}
                                className={`${errors.luas_rusak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luas_rusak && (
                                <HelperError>{errors.luas_rusak.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Luas Penanaman Baru / Tambah (hektar)" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Luas Penanaman Baru / Tambah (hektar)"
                                {...register('luas_penanaman_baru')}
                                className={`${errors.luas_penanaman_baru ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luas_penanaman_baru && (
                                <HelperError>{errors.luas_penanaman_baru.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mb-4'>
                    <div className="text-primary text-lg font-bold mb-2">Produksi (Kuintal)</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Dipanen Habis / Dibongkar" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Dipanen Habis / Dibongkar"
                                {...register('produksi_habis')}
                                className={`${errors.produksi_habis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.produksi_habis && (
                                <HelperError>{errors.produksi_habis.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Belum Habis" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Belum Habis"
                                {...register('produksi_belum_habis')}
                                className={`${errors.produksi_belum_habis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.produksi_belum_habis && (
                                <HelperError>{errors.produksi_belum_habis.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)"
                                {...register('rerata_harga')}
                                className={`${errors.rerata_harga ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.rerata_harga && (
                                <HelperError>{errors.rerata_harga.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Input
                                type="text"
                                placeholder="Keterangan"
                                {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/tanaman-pangan-holtikutura/validasi/sayuran-buah" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
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

export default TambahSayuranBuahKorluh