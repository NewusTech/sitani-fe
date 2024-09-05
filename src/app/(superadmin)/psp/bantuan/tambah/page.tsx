"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useLocalStorage from '@/hooks/useLocalStorage';
import InputComponent from '@/components/ui/InputKecDesa';
import Loading from '@/components/ui/Loading';


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
        .preprocess((val) => Number(val), z.number().min(1, { message: "Kecamatan wajib diisi" })),
    desa_id: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Desa wajib diisi" })),
    jenis_bantuan: z.string().min(1, { message: "Nama wajib diisi" }),
    periode: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Periode Penerimaan wajib diisi" })
    ),
    keterangan: z.string().min(1, { message: "Keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const BantuanTambah = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        control,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

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

    // GET ALL DESA

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     reset();
    // };


    // TAMBAH
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/psp/bantuan/create", data);
            console.log(data)
            // push
            navigate.push('/psp/bantuan');
            console.log("Success to create user:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create user:");
            return;
        }finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/psp/bantuan/get?page=1`);
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
                            <Label className='text-sm mb-1' label="Jenis Bantuan" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Jenis Bantuan"
                                {...register('jenis_bantuan')}
                                className={`${errors.jenis_bantuan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.jenis_bantuan && (
                                <HelperError>{errors.jenis_bantuan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Periode Penerimaan" />
                            <Input
                                autoFocus
                                type="date"
                                placeholder="Periode Penerimaan"
                                {...register('periode')}
                                className={`${errors.periode ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.periode && (
                                <HelperError>{errors.periode.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Textarea  {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : ''} py-2 text-sm h-[150px]`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/bantuan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
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

export default BantuanTambah