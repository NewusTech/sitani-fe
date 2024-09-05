"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { mutate, SWRResponse } from "swr";
import InputComponent from '@/components/ui/InputKecDesa';
import useLocalStorage from '@/hooks/useLocalStorage';

const formSchema = z.object({
    kecamatan_id: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Kecamatan wajib diisi" })),
    desa_id: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Desa wajib diisi" })),
    nama_poktan: z
        .string()
        .min(1, { message: "Nama Poktan wajib diisi" }),
    ketua_poktan: z
        .string()
        .min(1, { message: "Nama Ketua wajib diisi" }),
    titik_koordinat: z
        .string()
        .min(1, { message: "Titik Koordinat wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahDataPenerimaUppo = () => {

    // GET ALL KECAMATAN
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface Response {
        status: string;
        data: Kecamatan[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKecamatan }: SWRResponse<Response> = useSWR(
        `kecamatan/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // GET ALL DESA
    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
    }

    interface ResponseDesa {
        status: string;
        data: Desa[];
        message: string;
    }

    const { data: dataDesa }: SWRResponse<ResponseDesa> = useSWR(
        `desa/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET ALL DESA

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });
    const selectedKecamatan = Number(watch("kecamatan_id")); // Ensure conversion to number

    const kecamatanOptions = dataKecamatan?.data.map(kecamatan => ({
        id: kecamatan.id.toString(),
        name: kecamatan.nama,
    }));

    const desaOptions = dataDesa?.data
        .filter(desa => desa.kecamatanId === selectedKecamatan) // Ensure types match here
        .map(desa => ({
            id: desa.id.toString(),
            name: desa.nama,
        }));

    // const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    //     console.log(data);
    //     reset();
    // };

    // TAMBAH
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.post("/psp/penerima-uppo/create", data);
            console.log(data)
            // push
            navigate.push('/psp/data-penerima-uppo');
            console.log("Success to create user:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create user:");
            return;
        }
        mutate(`/psp/penerima-uppo/get`);
    };
    // TAMBAH

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                            <Controller
                                name="kecamatan_id"
                                control={control}
                                render={({ field }) => (
                                    <InputComponent
                                        typeInput="selectSearch"
                                        placeholder="Pilih Kecamatan"
                                        label="Kecamatan"
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={kecamatanOptions}
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
                                    <InputComponent
                                        typeInput="selectSearch"
                                        placeholder="Select Desa"
                                        label="Desa"
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={desaOptions}
                                    />
                                )}
                            />
                            {errors.desa_id && (
                                <p className="text-red-500">{errors.desa_id.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama Poktan" />
                            <Input
                                type="text"
                                placeholder="Pilih Nama Poktan"
                                {...register('nama_poktan')}
                                className={`${errors.nama_poktan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nama_poktan && (
                                <HelperError>{errors.nama_poktan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama Ketua" />
                            <Input
                                type="text"
                                placeholder="Nama Ketua"
                                {...register('ketua_poktan')}
                                className={`${errors.ketua_poktan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.ketua_poktan && (
                                <HelperError>{errors.ketua_poktan.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-1/2">
                            <Label className='text-sm mb-1' label="Titik Koordinat" />
                            <Input
                                type="text" // Changed to "text" to match schema, or use "number" if needed
                                placeholder="Pilih Titik Koordinat"
                                {...register('titik_koordinat')}
                                className={`${errors.titik_koordinat ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.titik_koordinat && (
                                <HelperError>{errors.titik_koordinat.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/data-penerima-uppo" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        Simpan
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TambahDataPenerimaUppo
