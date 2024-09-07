"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';

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
    desa_id: z
        .number()
        .min(1, "Desa is required")
        .transform((value) => Number(value)), // Mengubah string menjadi number
    tanggal: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Tanggal wajib diisi" })),
    nama_tanaman: z.string().min(1, { message: "Nama tanaman wajib diisi" }),
    luas_panen_habis: z.coerce.number().min(0, { message: "Luas panen habis wajib diisi" }),
    luas_panen_belum_habis: z.coerce.number().min(0, { message: "Luas panen belum habis wajib diisi" }),
    luas_rusak: z.coerce.number().min(0, { message: "Luas rusak wajib diisi" }),
    luas_penanaman_baru: z.coerce.number().min(0, { message: "Luas penanaman baru wajib diisi" }),
    produksi_habis: z.coerce.number().min(0, { message: "Produksi habis wajib diisi" }),
    produksi_belum_habis: z.coerce.number().min(0, { message: "Produksi belum habis wajib diisi" }),
    rerata_harga: z.coerce.number().min(0, { message: "Rata-rata harga wajib diisi" }),
    keterangan: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditTanamanBiofarmaka = () => {
    // INTEGRASI
    interface KorluhTanamanBiofarmakaResponse {
        status: number;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        korluhTanamanBiofarmakaId: number;
        namaTanaman: string;
        luasPanenHabis: number;
        luasPanenBelumHabis: number;
        luasRusak: number;
        luasPenanamanBaru: number;
        produksiHabis: number;
        produksiBelumHabis: number;
        rerataHarga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        korluhTanamanBiofarmaka: DetailItem;
    }

    interface DetailItem {
        id: number;
        kecamatanId: number;
        desaId: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string;
        updatedAt: string;
    }

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

    const KecamatanValue = watch("kecamatan_id");

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataTanaman, error } = useSWR<KorluhTanamanBiofarmakaResponse>(
        `/korluh/tanaman-biofarmaka/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                return null;
            }
        }
    );

    // setvalue
    const kecamatanId = watch("kecamatan_id");
    const [initialDesaId, setInitialDesaId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (dataTanaman) {
            setValue("nama_tanaman", dataTanaman.data.namaTanaman);
            setValue("tanggal", new Date(dataTanaman.data.korluhTanamanBiofarmaka.tanggal).toISOString().split('T')[0]);
            setValue("luas_panen_habis", dataTanaman.data.luasPanenHabis);
            setValue("luas_panen_belum_habis", dataTanaman.data.luasPanenBelumHabis);
            setValue("luas_rusak", dataTanaman.data.luasRusak);
            setValue("luas_penanaman_baru", dataTanaman.data.luasPenanamanBaru);
            setValue("produksi_habis", dataTanaman.data.produksiHabis);
            setValue("produksi_belum_habis", dataTanaman.data.produksiBelumHabis);
            setValue("rerata_harga", dataTanaman.data.rerataHarga);
            setValue("keterangan", dataTanaman.data.keterangan);
            setValue("kecamatan_id", dataTanaman.data.korluhTanamanBiofarmaka.kecamatanId);
            setInitialDesaId(dataTanaman.data.korluhTanamanBiofarmaka.desaId); // Save initial desa_id
            setValue("desa_id", dataTanaman.data.korluhTanamanBiofarmaka.desaId); // Set default value
        }
    }, [dataTanaman, setValue]);


    useEffect(() => {
        // Clear desa_id when kecamatan_id changes
        setValue("desa_id", initialDesaId ?? 0); // Reset to initial desa_id
    }, [kecamatanId, setValue, initialDesaId]);
    // setvalue

    // getone

    // Edit
    const kecamatanValue = watch("kecamatan_id");
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.put(`/korluh/tanaman-biofarmaka/update/${id}`, data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil di edit!',
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
            navigate.push('/bpp-kecamatan/tanaman-biofarmaka');
            console.log("Success to create Tanaman Hias:");
            // reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create Tanaman Hias:");
            return;
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/korluh/tanaman-biofarmaka/get`);
    };

    const [open, setOpen] = React.useState(false)
    const [value, setValueSelect] = React.useState("")

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-4">Edit Data Tanaman Biofarmaka</div>
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
                                <Label className='text-sm mb-1' label="Pilih Desa" />
                                <Controller
                                    name="desa_id"
                                    control={control}
                                    render={({ field }) => (
                                        <DesaValue
                                            // desaItems={filteredDesaItems}
                                            value={field.value}
                                            onChange={field.onChange}
                                            kecamatanValue={kecamatanValue}
                                        />
                                    )}
                                />
                                {errors.desa_id && (
                                    <p className="text-red-500 mt-1">{errors.desa_id.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama Tanaman" />
                                <Input
                                    type="text"
                                    placeholder="Nama Tanaman"
                                    {...register('nama_tanaman')}
                                    className={`${errors.nama_tanaman ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.nama_tanaman && (
                                    <HelperError>{errors.nama_tanaman.message}</HelperError>
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
                    </div>
                </div>

                <div className='mb-4'>
                    <div className="text-primary text-lg font-bold mb-2">Luas Panen (m²)</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Habis/Dibongkar" />
                            <Input
                                type="number"
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
                            <Label className='text-sm mb-1' label="Luas Rusak / Tidak Berhasil / Puso (m²)" />
                            <Input
                                type="number"
                                placeholder="Luas Rusak / Tidak Berhasil / Puso (m²)"
                                {...register('luas_rusak')}
                                className={`${errors.luas_rusak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luas_rusak && (
                                <HelperError>{errors.luas_rusak.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Luas Penanaman Baru / Tambah (m²)" />
                            <Input
                                type="number"
                                placeholder="Luas Penanaman Baru / Tambah (m²)"
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
                    <div className="text-primary text-lg font-bold mb-2">Produksi (Kilogram)</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Dipanen Habis / Dibongkar" />
                            <Input
                                type="number"
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
                    <Link href="/bpp-kecamatan/tanaman-hias" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Edit"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditTanamanBiofarmaka