"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import useSWR, { mutate } from 'swr';
import Loading from '@/components/ui/Loading';

// Format tanggal yang diinginkan (yyyy-mm-dd)
function formatDate(date: string): string {
  const [year, month] = date.split("-");
  // Convert the month to remove leading zeros (e.g., "06" -> "6")
  const formattedMonth = parseInt(month, 10).toString();
  return `${year}/${formattedMonth}`;
}

const formSchema = z.object({
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

interface Response {
  status: number;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  tphRealisasiPalawija2Id: number;
  kecamatanId: number;
  kacangHijauPanen: number;
  kacangHijauProduktivitas: number;
  kacangHijauProduksi: number;
  ubiKayuPanen: number;
  ubiKayuProduktivitas: number;
  ubiKayuProduksi: number;
  ubiJalarPanen: number;
  ubiJalarProduktivitas: number;
  ubiJalarProduksi: number;
  createdAt: string;
  updatedAt: string;
  tphRealisasiPalawija2: TphRealisasiPalawija2;
  kecamatan: Kecamatan;
}

interface TphRealisasiPalawija2 {
  id: number;
  bulan: string
  createdAt: string;
  updatedAt: string;
}

interface Kecamatan {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

const EditPalawija2Page = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: dataPalawija2, error } = useSWR<Response>(
    `/tph/realisasi-palawija-2/get/${id}`,
    async (url: string) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }
    }
  );
  const [date, setDate] = React.useState<Date>()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });
  type FormSchemaType = z.infer<typeof formSchema>;

  // Edit
  useEffect(() => {
    if (dataPalawija2) {
      setValue("kacang_hijau_panen", dataPalawija2?.data?.kacangHijauPanen);
      setValue("kacang_hijau_produktivitas", dataPalawija2?.data?.kacangHijauProduktivitas);
      setValue("kacang_hijau_produksi", dataPalawija2?.data?.kacangHijauProduksi);
      setValue("ubi_kayu_panen", dataPalawija2?.data?.ubiKayuPanen);
      setValue("ubi_kayu_produktivitas", dataPalawija2?.data?.ubiKayuProduktivitas);
      setValue("ubi_kayu_produksi", dataPalawija2?.data?.ubiKayuProduksi);
      setValue("ubi_jalar_panen", dataPalawija2?.data?.ubiJalarPanen);
      setValue("ubi_jalar_produktivitas", dataPalawija2?.data?.ubiJalarProduktivitas);
      setValue("ubi_jalar_produksi", dataPalawija2?.data?.ubiJalarProduksi);
    }
  }, [dataPalawija2, setValue]);

  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    try {
      await axiosPrivate.put(`/tph/realisasi-palawija-2/update/${id}`, data);
      // alert
      Swal.fire({
        icon: 'success',
        title: 'Data berhasil di edit!',
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
      console.log("Success to update user:", data);
      navigate.push('/tanaman-pangan-holtikutura/realisasi');
      reset();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
    mutate(`/tph/realisasi-palawija-2/get`);
  };
  // Edit

  return (
    <>
      <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Tambah Data Palawija 2</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form text-sm">
          {/* pilih kecamatan*/}

          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                <Input
                  type="text"
                  placeholder="Kecamatan"
                  disabled={true}
                  value={dataPalawija2?.data?.kecamatan.nama || ''}
                />
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Bulan" />
                <Input
                  type="text"
                  placeholder="Bulan"
                  disabled={true}
                  value={formatDate(dataPalawija2?.data?.tphRealisasiPalawija2.bulan || '')}
                />
              </div>
            </div>
          </div>

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
          <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white text-sm md:text-base w-[90px] md:w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            Batal
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[90px] md:w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
            {loading ? (
              <Loading />
            ) : (
              "Edit"
            )}
          </Button>
        </div>
      </form>
    </>
  )
}

export default EditPalawija2Page