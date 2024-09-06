"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from "@/components/ui/textarea"
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import { mutate } from "swr";
import Loading from '@/components/ui/Loading';


const OPTIONS: Option[] = [
    { label: 'Metro Kibang', value: "1" },
    { label: 'Batanghari', value: "2" },
    { label: 'Sekampung', value: "3" },
    { label: 'Margatiga', value: "4" },
    { label: 'Sekampung Udik', value: "5" },
    { label: 'Jabung', value: "6" },
    { label: 'Pasir Sakti', value: "7" },
    { label: 'Waway Karya', value: "8" },
    { label: 'Marga Sekampung', value: "9" },
    { label: 'Labuhan Maringgai', value: "10" },
    { label: 'Mataram Baru', value: "11" },
    { label: 'Bandar Sribawono', value: "12" },
    { label: 'Melinting', value: "13" },
    { label: 'Gunung Pelindung', value: "14" },
    { label: 'Way Jepara', value: "15" },
    { label: 'Braja Slebah', value: "16" },
    { label: 'Labuhan Ratu', value: "17" },
    { label: 'Sukadana', value: "18" },
    { label: 'Bumi Agung', value: "19" },
    { label: 'Batanghari Nuban', value: "20" },
    { label: 'Pekalongan', value: "21" },
    { label: 'Raman Utara', value: "22" },
    { label: 'Purbolinggo', value: "23" },
    { label: 'Way Bungur', value: "24" }
];


const formSchema = z.object({
    kecamatan_list: z
        .array(z.preprocess((val) => Number(val), z.number()))
        .min(1, { message: "Wilayah Desa Binaan wajib diisi" })
        .optional(),
    nama: z
        .string()
        .min(1, { message: "Nama wajib diisi" }),
    nip: z.
        preprocess((val) => Number(val), z.number().min(1, { message: "NIP wajib diisi" })),
    pangkat: z
        .string()
        .min(1, { message: "Pangkat wajib diisi" }),
    golongan: z
        .string()
        .min(1, { message: "Golongan wajib diisi" }),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" })
});


type FormSchemaType = z.infer<typeof formSchema>;

const PenyuluhanTambahDataKabupaten = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const handleSelectorChange = (selectedOptions: Option[]) => {
        setValue('kecamatan_list', selectedOptions.map(option => Number(option.value)));
    };


    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     // reset();
    // };

    // INTEGRASI
    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/penyuluh-kabupaten/create", data);
            console.log(data)
            // push
            navigate.push('/penyuluhan/data-kabupaten');
            console.log("Success to create user:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create user:");
            return;
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/penyuluh-kabupaten/get`);
    };
    // TAMBAH
    // INTEGRASI
    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Wilayah Desa Binaan (Kecamatan)" />
                            <MultipleSelector
                                className={`w-[98%] justify-between flex h-10 items-center rounded-full border border-primary bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${errors.kecamatan_list ? 'border-red-500' : ''}`}
                                defaultOptions={OPTIONS}
                                placeholder="Cari Kecamatan"
                                onChange={handleSelectorChange}
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600">
                                        Tidak ada data.
                                    </p>
                                }
                            />
                            {errors.kecamatan_list && (
                                <HelperError>{errors.kecamatan_list.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama" />
                            <Input
                                type="text"
                                placeholder="Nama"
                                {...register('nama')}
                                className={`${errors.nama ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nama && (
                                <HelperError>{errors.nama.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="NIP" />
                            <Input
                                type="number"
                                placeholder="NIP"
                                {...register('nip')}
                                className={`${errors.nip ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nip && (
                                <HelperError>{errors.nip.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pangkat" />
                            <Input
                                type="text"
                                placeholder="Pangkat"
                                {...register('pangkat')}
                                className={`${errors.pangkat ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.pangkat && (
                                <HelperError>{errors.pangkat.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Golongan" />
                            <Input
                                type="text"
                                placeholder="Golongan"
                                {...register('golongan')}
                                className={`${errors.golongan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.golongan && (
                                <HelperError>{errors.golongan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Textarea  {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/penyuluhan/data-kabupaten" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Simpan"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default PenyuluhanTambahDataKabupaten