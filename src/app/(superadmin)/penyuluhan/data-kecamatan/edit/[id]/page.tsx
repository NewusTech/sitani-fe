"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import Swal from "sweetalert2";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useRouter, useParams } from 'next/navigation';
import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import HelperError from "@/components/ui/HelperError";
import SelectKecamatan from "@/components/superadmin/KecamatanSelect";
import SelectMultipleDesa from "@/components/superadmin/DesaSelect/page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/components/ui/Loading";

interface KecamatanOption {
    id: number;
    nama: string;
}

interface DesaOption {
    id: number;
    nama: string;
    kecamatanId: number;
}

interface ResponseKecamatan {
    status: string;
    data: KecamatanOption[];
    message: string;
}

interface ResponseDesa {
    status: string;
    data: DesaOption[];
    message: string;
}

const formSchema = z.object({
    kecamatan_id: z
        .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().positive({ message: "Nama Kecamatan wajib diisi" }).optional()),
    desa_list: z
        .array(z.preprocess((val) => Number(val), z.number()))
        .min(1, { message: "Wilayah Desa Binaan wajib diisi" })
        .optional(),
    nama: z.string().min(1, { message: "Nama wajib diisi" }),
    nip: z
        .preprocess((val) => Number(val), z.number().optional()),
    pangkat: z.string().optional(),
    golongan: z.string().optional(),
    keterangan: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditPenyuluhDataKecamatan = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();

    const { data: dataKecamatan } = useSWR<ResponseKecamatan>(
        "kecamatan/get",
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const { data: dataDesa } = useSWR<ResponseDesa>(
        "desa/get",
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const params = useParams();
    const { id } = params;

    const { data: dataUser, error } = useSWR<any>(
        `penyuluh-kecamatan/get/${id}`,
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

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const selectedKecamatanId = watch("kecamatan_id");

    const kecamatanOptions: KecamatanOption[] =
        dataKecamatan?.data.map((kec) => ({
            id: kec.id,
            nama: kec.nama,
        })) || [];

    const filteredDesaOptions: DesaOption[] =
        selectedKecamatanId ? dataDesa?.data.filter((desa) => desa.kecamatanId === selectedKecamatanId) || [] : [];

    const handleSelectorChange = (selectedOptions: DesaOption[]) => {
        const desaIds = selectedOptions.map((option) => option.id);
        setValue("desa_list", desaIds);
    };

    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.put(`/penyuluh-kecamatan/update/${id}`, data);
            // console.log("data", data);

            Swal.fire({
                icon: "success",
                title: "Data berhasil diperbarui!",
                text: "Data sudah disimpan dalam sistem!",
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
                    timerProgressBar: "bg-gradient-to-r from-blue-400 to-green-400",
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });

            navigate.push("/penyuluhan/data-kecamatan");
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memperbarui data!';
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
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dataUser) {
            setValue("kecamatan_id", dataUser.data.kecamatanId);
            setValue("desa_list", dataUser.data.desa.map((desa: DesaOption) => desa.id));
            setValue("nama", dataUser.data.nama);
            setValue("nip", dataUser.data.nip);
            setValue("pangkat", dataUser.data.pangkat);
            setValue("golongan", dataUser.data.golongan);
            setValue("keterangan", dataUser.data.keterangan);
        }
    }, [dataUser, setValue]);

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:gap-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className="text-sm mb-1" label="Pilih Kecamatan" />
                            <Controller
                                name="kecamatan_id"
                                control={control}
                                render={({ field }) => (
                                    <SelectKecamatan
                                        kecamatanOptions={kecamatanOptions}
                                        selectedKecamatan={kecamatanOptions.find((opt) => opt.id === field.value) || null}
                                        onChange={(selectedKecamatan) => field.onChange(selectedKecamatan ? selectedKecamatan.id : null)}
                                    />
                                )}
                            />
                            {errors.kecamatan_id && <p className="text-red-500 text-sm">{errors.kecamatan_id.message}</p>}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className="text-sm mb-1" label="Wilayah Desa Binaan" />
                            <Controller
                                name="desa_list"
                                control={control}
                                render={({ field }) => (
                                    <SelectMultipleDesa
                                        desaOptions={filteredDesaOptions}
                                        selectedDesa={filteredDesaOptions.filter((opt) => field.value?.includes(opt.id))}
                                        onChange={handleSelectorChange}
                                    />
                                )}
                            />
                            {errors.desa_list && <p className="text-red-500 text-sm">{errors.desa_list.message}</p>}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:gap-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className="text-sm mb-1" label="Nama" />
                            <Input
                                type="text"
                                placeholder="Nama"
                                {...register("nama")}
                                className={`${errors.nama ? "border-red-500" : "py-5 text-sm"}`}
                            />
                            {errors.nama && <HelperError>{errors.nama.message}</HelperError>}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className="text-sm mb-1" label="NIP" />
                            <Input
                                type="number"
                                placeholder="NIP"
                                {...register("nip")}
                                className={`${errors.nip ? "border-red-500" : "py-5 text-sm"}`}
                            />
                            {errors.nip && <HelperError>{errors.nip.message}</HelperError>}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:gap-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className="text-sm mb-1" label="Pangkat" />
                            <Input
                                type="text"
                                placeholder="Pangkat"
                                {...register("pangkat")}
                                className={`${errors.pangkat ? "border-red-500" : "py-5 text-sm"}`}
                            />
                            {errors.pangkat && <HelperError>{errors.pangkat.message}</HelperError>}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className="text-sm mb-1" label="Golongan" />
                            <Input
                                type="text"
                                placeholder="Golongan"
                                {...register("golongan")}
                                className={`${errors.golongan ? "border-red-500" : "py-5 text-sm"}`}
                            />
                            {errors.golongan && <HelperError>{errors.golongan.message}</HelperError>}
                        </div>
                    </div>
                    <div className="flex flex-col mb-2 w-full">
                        <Label className="text-sm mb-1" label="Keterangan" />
                        <Textarea
                            placeholder="Keterangan"
                            {...register("keterangan")}
                            className={`${errors.keterangan ? "border-red-500" : "py-5 text-sm"}`}
                        />
                        {errors.keterangan && <HelperError>{errors.keterangan.message}</HelperError>}
                    </div>
                </div>
                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/penyuluhan/data-kecamatan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Simpan"
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default EditPenyuluhDataKecamatan;
