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

function formatDate(date: string): string {
  const [year, month] = date.split("-");
  // Convert the month to remove leading zeros (e.g., "06" -> "6")
  const formattedMonth = parseInt(month, 10).toString();
  return `${year}/${formattedMonth}`;
}


const formSchema = z.object({
  kecamatan_id: z
    .number()
    .min(1, "Kecamatan wajib disi")
    .transform((value) => Number(value)), // Convert string to number
  bulan: z.preprocess(
    (val) => typeof val === "string" ? formatDate(val) : val,
    z.string().min(1, { message: "Bulan wajib diisi" })
  ),
  panen_lahan_sawah: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  produktivitas_lahan_sawah: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  produksi_lahan_sawah: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  panen_lahan_kering: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  produktivitas_lahan_kering: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  produksi_lahan_kering: z
    .preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahRealisasiPadiPage = () => {
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
  const [activeTab, setActiveTab] = useState("padi");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();


  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true); // Set loading to true when the form is submitted
    try {
      await axiosPrivate.post("/tph/realisasi-padi/create", data);
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

      navigate.push("/tanaman-pangan-holtikutura/realisasi");
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
      <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Tambah Data Padi</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form">
          {/* pilih kecamatan - desa */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Bulan" />
                <Input
                  type="month"
                  placeholder="bulan"
                  {...register('bulan')}
                  className={`${errors.bulan ? 'border-red-500' : ''}`}
                />
                {errors.bulan && (
                  <HelperError>{errors.bulan.message}</HelperError>
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
          <div className="font-semibold text-primary text-lg">Lahan Sawah</div>
          {/*  */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Panen"
                  {...register('panen_lahan_sawah')}
                  className={`${errors.panen_lahan_sawah ? 'border-red-500' : ''}`}
                />
                {errors.panen_lahan_sawah && (
                  <HelperError>{errors.panen_lahan_sawah.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Produktivitas"
                  {...register('produktivitas_lahan_sawah')}
                  className={`${errors.produktivitas_lahan_sawah ? 'border-red-500' : ''}`}
                />
                {errors.produktivitas_lahan_sawah && (
                  <HelperError>{errors.produktivitas_lahan_sawah.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* produksi lahan sawah */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 md:w-1/2 md:pr-3 w-full">
                <Label className='text-sm mb-1' label="Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Produksi"
                  {...register('produksi_lahan_sawah')}
                  className={`${errors.produksi_lahan_sawah ? 'border-red-500' : ''}`}
                />
                {errors.produksi_lahan_sawah && (
                  <HelperError>{errors.produksi_lahan_sawah.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          <div className="font-semibold text-primary text-lg">Lahan Kering</div>
          {/* produktivitas_lahan_kering - produksi_lahan_kering */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Panen"
                  {...register('panen_lahan_kering')}
                  className={`${errors.panen_lahan_kering ? 'border-red-500' : ''}`}
                />
                {errors.panen_lahan_kering && (
                  <HelperError>{errors.panen_lahan_kering.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Produktivitas"
                  {...register('produktivitas_lahan_kering')}
                  className={`${errors.produktivitas_lahan_kering ? 'border-red-500' : ''}`}
                />
                {errors.produktivitas_lahan_kering && (
                  <HelperError>{errors.produktivitas_lahan_kering.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          {/* produksi lahan kering */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 md:w-1/2 md:pr-3 w-full">
                <Label className='text-sm mb-1' label="Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Produksi"
                  {...register('produksi_lahan_kering')}
                  className={`${errors.produksi_lahan_kering ? 'border-red-500' : ''}`}
                />
                {errors.produksi_lahan_kering && (
                  <HelperError>{errors.produksi_lahan_kering.message}</HelperError>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white text-sm md:text-base w-[90px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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

export default TambahRealisasiPadiPage