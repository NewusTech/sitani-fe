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
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import useLocalStorage from '@/hooks/useLocalStorage';
import SelectMultipleHak from '@/components/superadmin/HakMultiple';
import Swal from 'sweetalert2';


const formSchema = z.object({
  role_name: z
    .string()
    .min(1, "Role wajib diisi"),
  description: z
    .string()
    .min(1, "Deksripsi wajib diisi"),
  permission_list: z
    .array(z.preprocess(val => Number(val), z.number()))
    .min(1, { message: "Hak akses wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahPeran = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  interface KecamatanOption {
    id: number;
    permissionName: string;
  }

  interface ResponseKecamatan {
    status: string;
    data: KecamatanOption[];
    message: string;
  }

  const [accessToken] = useLocalStorage("accessToken", "");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: dataKecamatan } = useSWR<ResponseKecamatan>(
    "permission/get",
    (url: string) =>
      axiosPrivate.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => res.data)
  );


  // TAMBAH
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true); // Set loading to true when the form is submitted
    try {
      await axiosPrivate.post("/role/create", data);
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
      navigate.push('/peran-pengguna/peran');
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
    mutate(`/role/get`);
  };

  // TAMBAH
  return (
    <>
      <div className="text-primary md:text-2xl text-xl font-bold mb-5">Tambah Peran</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="gap-3 min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form">
          <div className="wrap">
            {/* */}
            <div className="mb-2 mt-4">
              <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Nama Peran" />
                  <Input
                    type="text"
                    placeholder="Nama Peran"
                    {...register('role_name')}
                    className={`text-sm py-5 ${errors.role_name ? 'border-red-500' : ''}`}
                  />
                  {errors.role_name && (
                    <HelperError>{errors.role_name.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Deskripsi" />
                  <Input
                    type="text"
                    placeholder="Deskripsi"
                    {...register('description')}
                    className={`text-sm py-5 ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && (
                    <HelperError>{errors.description.message}</HelperError>
                  )}
                </div>
              </div>
            </div>
            {/* */}
            {/* */}
            <div className="mb-2 mt-4">
              <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Hak Akses" />
                  <Controller
                    name="permission_list"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectMultipleHak
                        placeholder='Pilih Hak Akses'
                        kecamatanOptions={dataKecamatan?.data || []}
                        selectedKecamatan={dataKecamatan?.data?.filter(option =>
                          value?.includes(option.id)
                        ) || []}
                        onChange={(selected: KecamatanOption[]) => onChange(selected.map(d => d.id))}
                      />
                    )}
                  />
                  {errors.permission_list && (
                    <p className="text-red-500">{errors.permission_list.message}</p>
                  )}
                </div>
              </div>
            </div>
            {/* */}
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/peran-pengguna/peran" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
            Batal
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[120px]">
            Tambah
          </Button>
        </div>
      </form>
    </>
  )
}

export default TambahPeran