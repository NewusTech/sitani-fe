"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SelectKecamatan from '@/components/superadmin/KecamatanSelect';
import useSWR, { mutate } from "swr";
import Swal from "sweetalert2";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams, useRouter } from 'next/navigation';
import SelectPeran from '@/components/superadmin/PeranMultiple';
import Loading from '@/components/ui/Loading';

interface UserKecamatan {
    user_id: number;
    kecamatan_id: number;
  }
  
  interface Kecamatan {
    id: number;
    nama: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    user_kecamatan: UserKecamatan;
  }
  
  interface UserRole {
    user_id: number;
    role_id: number;
  }
  
  interface Role {
    id: number;
    roleName: string;
    description: string;
    user_roles: UserRole;
  }
  
  interface UserData {
    id: number;
    email: string;
    nip: number;
    name: string;
    pangkat: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    kecamatans: Kecamatan[];
    roles: Role[];
  }
  
  interface UserResponse {
    status: number;
    message: string;
    data: UserData;
  }
  

const formSchema = z.object({
    role_id: z
        .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().positive({ message: "Peran wajib diisi" }))
        .optional(),
    email: z
        .string()
        .min(1, { message: "Email wajib diisi" })
        .optional(),
    password: z
        .string()
        .min(6, { message: "Password minimal 6 karakter" })
        .optional(),
    name: z
        .string()
        .min(1, { message: "Nama wajib diisi" })
        .optional(),
    nip: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "NIP wajib diisi" }))
        .optional(),
    pangkat: z
        .string()
        .min(1, { message: "Pangkat wajib diisi" })
        .optional(),
    kecamatan_id: z
        .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().positive({ message: "Nama Kecamatan wajib diisi" }))
        .optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface KecamatanOption {
    id: number;
    nama: string;
}
// Define API response types
interface ResponseKecamatan {
    status: string;
    data: KecamatanOption[];
    message: string;
}

interface PeranOption {
    id: number;
    roleName: string;
}

interface ResponsePeran {
    status: string;
    data: PeranOption[];
    message: string;
}

const EditPengguna = () => {
    // Hooks for local storage, axios, and navigation
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);


    // Fetching data for kecamatan and desa
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

    // Fetching data for kecamatan and desa
    const { data: dataPeran } = useSWR<ResponsePeran>(
        "role/get",
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

    // get one
    const params = useParams();
    const { id } = params;

    const { data: dataUser, error } = useSWR<UserResponse>(
        `user/get/${id}`,
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

    useEffect(() => {
        if (dataUser && dataUser.data) {
            setValue('email', dataUser?.data?.email || '');
            setValue('name', dataUser?.data?.name || '');
            setValue('nip', dataUser?.data?.nip);
            setValue('pangkat', dataUser?.data?.pangkat || '');
            setValue('role_id', dataUser?.data?.roles[0]?.id);
            setValue('kecamatan_id', dataUser?.data?.kecamatans[0]?.id);
        }
    }, [dataUser, setValue]);
    // get one

    // Transform fetched data to be used in selectors
    const kecamatanOptions: KecamatanOption[] =
        dataKecamatan?.data?.map((kec) => ({
            id: kec.id,
            nama: kec.nama,
        })) || [];

    // Transform fetched data to be used in selectors
    const peranOptions: PeranOption[] =
        dataPeran?.data?.map((kec) => ({
            id: kec.id,
            roleName: kec.roleName,
        })) || [];

    // TAMBAH
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/user/create", data);
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
            navigate.push('/peran-pengguna/pengguna');
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
        mutate(`/user/get`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="wrap-form flex-col gap-2 h-[70vh]">
                    {/* pilih peran - katagori bidang */}
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Email" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Email"
                                    {...register('email')}
                                    className={`${errors.email ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.email && (
                                    <HelperError>{errors.email.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Password" />
                                <Input
                                    type="password"
                                    placeholder="Masukkan Password"
                                    {...register('password')}
                                    className={`${errors.password ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.password && (
                                    <HelperError>{errors.password.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Nama"
                                    {...register('name')}
                                    className={`${errors.name ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.name && (
                                    <HelperError>{errors.name.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="NIP" />
                                <Input
                                    type="number"
                                    placeholder="Masukkan NIP"
                                    {...register('nip')}
                                    className={`${errors.nip ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.nip && (
                                    <HelperError>{errors.nip.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pangkat" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Pangkat"
                                    {...register('pangkat')}
                                    className={`${errors.pangkat ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.pangkat && (
                                    <HelperError>{errors.pangkat.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className="text-sm mb-1" label="Pilih Peran" />
                                <Controller
                                    name="role_id"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectPeran
                                            kecamatanOptions={peranOptions}
                                            selectedKecamatan={peranOptions.find((opt) => opt.id === field.value) || null}
                                            onChange={(selectedKecamatan) => field.onChange(selectedKecamatan ? selectedKecamatan.id : null)}
                                        />
                                    )}
                                />
                                {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 md:w-1/2 md:pr-3 w-full">
                            <Label className="text-sm mb-1" label="Pilih Kecamatan (Khusus Korluh)" />
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
                    </div>
                </div>

                <div className="mb-10 mt-8 md:mt-3 flex justify-end gap-3">
                    <Link href="/peran-pengguna/pengguna" className='bg-white text-sm md:text-base w-[90px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[90px] md:w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
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

export default EditPengguna