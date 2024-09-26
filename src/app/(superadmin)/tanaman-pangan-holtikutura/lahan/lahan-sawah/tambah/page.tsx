"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import Swal from "sweetalert2";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import Loading from '@/components/ui/Loading';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';


const formSchema = z.object({
  kecamatan_id: z
    .number()
    .min(1, "Kecamatan wajib disi")
    .transform((value) => Number(value)), // Convert string to number
  tahun: z
    .string()
    .min(1, { message: "Tahun wajib diisi" }),
  irigasi_teknis: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  irigasi_setengah_teknis: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  irigasi_sederhana: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  irigasi_desa: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  tadah_hujan: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  pasang_surut: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  lebak: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  lainnya: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  keterangan: z
    .string()
    .min(0, { message: "keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahLahanSawahPage = () => {
  const [date, setDate] = React.useState<Date>()

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

  // const onSubmit = (data: FormSchemaType) => {
  //   console.log(data);
  // };

  // Submit handler for form
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("lahanSawah");


  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true); // Set loading to true when the form is submitted
    try {
      await axiosPrivate.post("/tph/lahan-sawah/create", data);
      // console.log("data= ", data)
      localStorage.setItem('activeTab', activeTab);
      // Success alert
      Swal.fire({
        icon: "success",
        title: "Data berhasil ditambahkan!",
        text: "Data sudah disimpan dalam sistem!",
        timer: 2000,
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

      navigate.push("/tanaman-pangan-holtikutura/lahan");
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
  };
  return (
    <>
      <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Tambah Data Lahan Sawah</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form text-sm">
          {/* pilih kecamatan - desa */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Tahun" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Tahun"
                  {...register('tahun')}
                  className={`${errors.tahun ? 'border-red-500' : ''}`}
                />
                {errors.tahun && (
                  <HelperError>{errors.tahun.message}</HelperError>
                )}
              </div>
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
          {/* irigasi teknis - 1/2 */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi Teknis" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Irigasi Teknis"
                  {...register('irigasi_teknis')}
                  className={`${errors.irigasi_teknis ? 'border-red-500' : ''}`}
                />
                {errors.irigasi_teknis && (
                  <HelperError>{errors.irigasi_teknis.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi 1/2 Teknis" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Irigasi 1/2 Teknis"
                  {...register('irigasi_setengah_teknis')}
                  className={`${errors.irigasi_setengah_teknis ? 'border-red-500' : ''}`}
                />
                {errors.irigasi_setengah_teknis && (
                  <HelperError>{errors.irigasi_setengah_teknis.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* desan - pasang */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi Sederhana" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Irigasi Sederhana"
                  {...register('irigasi_sederhana')}
                  className={`${errors.irigasi_sederhana ? 'border-red-500' : ''}`}
                />
                {errors.irigasi_sederhana && (
                  <HelperError>{errors.irigasi_sederhana.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Irigasi Desa" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Irigasi Desa"
                  {...register('irigasi_desa')}
                  className={`${errors.irigasi_desa ? 'border-red-500' : ''}`}
                />
                {errors.irigasi_desa && (
                  <HelperError>{errors.irigasi_desa.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* tadah_hujan - pasang_surut */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Tadah Hujan" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Tadah Hujan"
                  {...register('tadah_hujan')}
                  className={`${errors.tadah_hujan ? 'border-red-500' : ''}`}
                />
                {errors.tadah_hujan && (
                  <HelperError>{errors.tadah_hujan.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pasang Surut" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Pasang Surut"
                  {...register('pasang_surut')}
                  className={`${errors.pasang_surut ? 'border-red-500' : ''}`}
                />
                {errors.pasang_surut && (
                  <HelperError>{errors.pasang_surut.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Lebak" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Lebak"
                  {...register('lebak')}
                  className={`${errors.lebak ? 'border-red-500' : ''}`}
                />
                {errors.lebak && (
                  <HelperError>{errors.lebak.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Lainnya" />
                <Input
                  autoFocus
                  type="number"
                  step="0.000001"
                  placeholder="Lainnya"
                  {...register('lainnya')}
                  className={`${errors.lainnya ? 'border-red-500' : ''}`}
                />
                {errors.lainnya && (
                  <HelperError>{errors.lainnya.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 md:w-1/2 md:pr-3 w-full">
                <Label className='text-sm mb-1' label="Keterangan" />
                <Input
                  autoFocus
                  type="text"
                  placeholder="Keterangan"
                  {...register('keterangan')}
                  className={`${errors.keterangan ? 'border-red-500' : ''}`}
                />
                {errors.keterangan && (
                  <HelperError>{errors.keterangan.message}</HelperError>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/tanaman-pangan-holtikutura/lahan" className='bg-white text-sm md:text-base w-[90px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            Batal
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[90px] md:w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
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

export default TambahLahanSawahPage