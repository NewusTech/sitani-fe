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
import SelectMultipleKecamatan from '@/components/superadmin/KecamatanMultiple';


const formSchema = z.object({
  nama: z
    .string()
    .min(1, "Email wajib diisi"),
  kecamatan_list: z
    .array(z.preprocess(val => Number(val), z.number()))
    .min(1, { message: "Wilayah Desa Binaan wajib diisi" })
    .optional(),
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
    nama: string;
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
    "kecamatan/get",
    (url: string) =>
      axiosPrivate.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(res => res.data)
  );


  // TAMBAH
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      // await axiosPrivate.post("/user/create", data);
      console.log(data)
      // push
      // navigate.push('/peran-pengguna/peran');
      console.log("Success to create user:");
      reset()
    } catch (e: any) {
      console.log(data)
      console.log("Failed to create user:");
      return;
    }
    mutate(`/user/get`);
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
                    {...register('nama')}
                    className={`${errors.nama ? 'border-red-500' : ''}`}
                  />
                  {errors.nama && (
                    <HelperError>{errors.nama.message}</HelperError>
                  )}
                </div>
                <div className="flex flex-col mb-2 w-full">
                  <Label className='text-sm mb-1' label="Permission" />
                  <Controller
                    name="kecamatan_list"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <SelectMultipleKecamatan
                        kecamatanOptions={dataKecamatan?.data || []}
                        selectedKecamatan={dataKecamatan?.data?.filter(option =>
                          value?.includes(option.id)
                        ) || []}
                        onChange={(selected: KecamatanOption[]) => onChange(selected.map(d => d.id))}
                      />
                    )}
                  />
                  {errors.kecamatan_list && (
                    <p className="text-red-500">{errors.kecamatan_list.message}</p>
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
            Simpan
          </Button>
        </div>
      </form>
    </>
  )
}

export default TambahPeran