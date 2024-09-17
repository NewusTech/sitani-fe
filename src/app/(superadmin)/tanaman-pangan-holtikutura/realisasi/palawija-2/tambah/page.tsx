"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { mutate } from 'swr';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import Loading from '@/components/ui/Loading';

// Format tanggal yang diinginkan (yyyy-mm-dd)
function formatDate(date: string): string {
  const [year, month] = date.split("-");
  // Convert the month to remove leading zeros (e.g., "06" -> "6")
  const formattedMonth = parseInt(month, 10).toString();
  return `${year}/${formattedMonth}`;
}

const formSchema = z.object({
  kecamatan_id: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "Kecamatan wajib diisi" })),
  bulan: z.preprocess(
    (val) => typeof val === "string" ? formatDate(val) : val,
    z.string().min(1, { message: "Bulan wajib diisi" })
  ),
  kacang_hijau_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kacang_hijau_produktivitas: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kacang_hijau_produksi: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  ubi_kayu_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  ubi_kayu_produktivitas: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  ubi_kayu_produksi: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  ubi_jalar_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  ubi_jalar_produktivitas: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  ubi_jalar_produksi: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahPalawija2Page = () => {
  const [date, setDate] = React.useState<Date>()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    control,
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
      await axiosPrivate.post("/tph/realisasi-palawija-2/create", data);
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
      navigate.push('/tanaman-pangan-holtikutura/realisasi');
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
    mutate(`/tph/realisasi-palawija-2/get`);
  };
  // TAMBAH

  return (
    <>
      <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data Palawija 2</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form text-sm">
          {/* pilih kecamatan - desa */}
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
            </div>
          </div>
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Bulan" />
                <Input
                  type="month"
                  placeholder="Bulan"
                  {...register('bulan')}
                  className={`${errors.bulan ? 'border-red-500' : 'py-5 text-sm'}`}
                />
                {errors.bulan && (
                  <HelperError>{errors.bulan.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* produktivitas - produksi */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kacang Hijau Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kacang Hijau Panen"
                  {...register('kacang_hijau_panen')}
                  className={`${errors.kacang_hijau_panen ? 'border-red-500' : ''}`}
                />
                {errors.kacang_hijau_panen && (
                  <HelperError>{errors.kacang_hijau_panen.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kacang Hijau Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kacang Hijau Produktivitas"
                  {...register('kacang_hijau_produktivitas')}
                  className={`${errors.kacang_hijau_produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.kacang_hijau_produktivitas && (
                  <HelperError>{errors.kacang_hijau_produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kacang Hijau Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kacang Hijau Produksi"
                  {...register('kacang_hijau_produksi')}
                  className={`${errors.kacang_hijau_produksi ? 'border-red-500' : ''}`}
                />
                {errors.kacang_hijau_produksi && (
                  <HelperError>{errors.kacang_hijau_produksi.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Ubi Kayu Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Ubi Kayu Panen"
                  {...register('ubi_kayu_panen')}
                  className={`${errors.ubi_kayu_panen ? 'border-red-500' : ''}`}
                />
                {errors.ubi_kayu_panen && (
                  <HelperError>{errors.ubi_kayu_panen.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Ubi Kayu Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Ubi Kayu Produktivitas"
                  {...register('ubi_kayu_produktivitas')}
                  className={`${errors.ubi_kayu_produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.ubi_kayu_produktivitas && (
                  <HelperError>{errors.ubi_kayu_produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Ubi Kayu Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Ubi Kayu Produksi"
                  {...register('ubi_kayu_produksi')}
                  className={`${errors.ubi_kayu_produksi ? 'border-red-500' : ''}`}
                />
                {errors.ubi_kayu_produksi && (
                  <HelperError>{errors.ubi_kayu_produksi.message}</HelperError>
                )}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Ubi Jalar Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Ubi Jalar Panen"
                  {...register('ubi_jalar_panen')}
                  className={`${errors.ubi_jalar_panen ? 'border-red-500' : ''}`}
                />
                {errors.ubi_jalar_panen && (
                  <HelperError>{errors.ubi_jalar_panen.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Ubi Jalur Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Ubi Jalur Produktivitas"
                  {...register('ubi_jalar_produktivitas')}
                  className={`${errors.ubi_jalar_produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.ubi_jalar_produktivitas && (
                  <HelperError>{errors.ubi_jalar_produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Ubi Jalar Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Ubi Jalar Produksi"
                  {...register('ubi_jalar_produksi')}
                  className={`${errors.ubi_jalar_produksi ? 'border-red-500' : ''}`}
                />
                {errors.ubi_jalar_produksi && (
                  <HelperError>{errors.ubi_jalar_produksi.message}</HelperError>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
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

export default TambahPalawija2Page