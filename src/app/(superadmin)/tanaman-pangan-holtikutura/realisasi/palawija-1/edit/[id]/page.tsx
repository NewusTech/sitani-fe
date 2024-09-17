"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
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
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import useSWR, { mutate } from 'swr';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import useLocalStorage from '@/hooks/useLocalStorage';
import Loading from '@/components/ui/Loading';

// Format tanggal yang diinginkan (yyyy-mm-dd)
function formatDate(date: string): string {
  const [year, month] = date.split("-");
  // Convert the month to remove leading zeros (e.g., "06" -> "6")
  const formattedMonth = parseInt(month, 10).toString();
  return `${year}/${formattedMonth}`;
}

const formSchema = z.object({
  jagung_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  jagung_produktivitas: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  jagung_produksi: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kedelai_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kedelai_produktivitas: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kedelai_produksi: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kacang_tanah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kacang_tanah_produktivitas: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
  kacang_tanah_produksi: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditPalawija1Page = () => {
  interface Response {
    status: number;
    message: string;
    data: Data;
  }

  interface Data {
    id: number;
    tphRealisasiPalawija1Id: number;
    kecamatanId: number;
    jagungPanen: number;
    jagungProduktivitas: number;
    jagungProduksi: number;
    kedelaiPanen: number;
    kedelaiProduktivitas: number;
    kedelaiProduksi: number;
    kacangTanahPanen: number;
    kacangTanahProduktivitas: number;
    kacangTanahProduksi: number;
    createdAt: string;
    updatedAt: string;
    tphRealisasiPalawija1: TphRealisasiPalawija1;
    kecamatan: Kecamatan;
  }

  interface TphRealisasiPalawija1 {
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

  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: dataPalawija1, error } = useSWR<Response>(
    `/tph/realisasi-palawija-1/get/${id}`,
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
    if (dataPalawija1) {
      setValue("jagung_panen", dataPalawija1?.data?.jagungPanen);
      setValue("jagung_produktivitas", dataPalawija1?.data?.jagungProduktivitas);
      setValue("jagung_produksi", dataPalawija1?.data?.jagungProduksi);
      setValue("kedelai_panen", dataPalawija1?.data?.kedelaiPanen);
      setValue("kedelai_produktivitas", dataPalawija1?.data?.kedelaiProduktivitas);
      setValue("kedelai_produksi", dataPalawija1?.data?.kedelaiProduksi);
      setValue("kacang_tanah_panen", dataPalawija1?.data?.kacangTanahPanen);
      setValue("kacang_tanah_produktivitas", dataPalawija1?.data?.kacangTanahProduktivitas);
      setValue("kacang_tanah_produksi", dataPalawija1?.data?.kacangTanahProduksi);
    }
  }, [dataPalawija1, setValue]);


  const [loading, setLoading] = useState(false);
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    try {
      await axiosPrivate.put(`/tph/realisasi-palawija-1/update/${id}`, data);
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
    mutate(`/tph/realisasi-palawija-1/get`);
  };
  // Edit


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11, so we add 1
    return `${year}/${month}`;
  };

  return (
    <>
      <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data Palawija 1</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form text-sm">
          {/* pilih kecamatan - desa */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                <Input
                  type="text"
                  placeholder="Kecamatan"
                  disabled={true}
                  value={dataPalawija1?.data?.kecamatan.nama || ''}
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
                  value={formatDate(dataPalawija1?.data?.tphRealisasiPalawija1.bulan || '')}
                />
              </div>
            </div>
          </div>
          {/* produktivitas - produksi */}
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Jagung Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Jagung Panen"
                  {...register('jagung_panen')}
                  className={`${errors.jagung_panen ? 'border-red-500' : ''}`}
                />
                {errors.jagung_panen && (
                  <HelperError>{errors.jagung_panen.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Jagung Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Jagung Produktivitas"
                  {...register('jagung_produktivitas')}
                  className={`${errors.jagung_produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.jagung_produktivitas && (
                  <HelperError>{errors.jagung_produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Jagung Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Jagung Produksi"
                  {...register('jagung_produksi')}
                  className={`${errors.jagung_produksi ? 'border-red-500' : ''}`}
                />
                {errors.jagung_produksi && (
                  <HelperError>{errors.jagung_produksi.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kedelai Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kedelai Panen"
                  {...register('kedelai_panen')}
                  className={`${errors.kedelai_panen ? 'border-red-500' : ''}`}
                />
                {errors.kedelai_panen && (
                  <HelperError>{errors.kedelai_panen.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kedelai Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kedelai Produktivitas"
                  {...register('kedelai_produktivitas')}
                  className={`${errors.kedelai_produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.kedelai_produktivitas && (
                  <HelperError>{errors.kedelai_produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kedelai Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kedelai Produksi"
                  {...register('kedelai_produksi')}
                  className={`${errors.kedelai_produksi ? 'border-red-500' : ''}`}
                />
                {errors.kedelai_produksi && (
                  <HelperError>{errors.kedelai_produksi.message}</HelperError>
                )}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kacang Tanah Panen" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kacang Tanah Panen"
                  {...register('kacang_tanah_panen')}
                  className={`${errors.kacang_tanah_panen ? 'border-red-500' : ''}`}
                />
                {errors.kacang_tanah_panen && (
                  <HelperError>{errors.kacang_tanah_panen.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kacang Tanah Produktivitas" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kacang Tanah Produktivitas"
                  {...register('kacang_tanah_produktivitas')}
                  className={`${errors.kacang_tanah_produktivitas ? 'border-red-500' : ''}`}
                />
                {errors.kacang_tanah_produktivitas && (
                  <HelperError>{errors.kacang_tanah_produktivitas.message}</HelperError>
                )}
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Kacang Tanah Produksi" />
                <Input
                  type="number"
                  step="0.00005"
                  placeholder="Kacang Tanah Produksi"
                  {...register('kacang_tanah_produksi')}
                  className={`${errors.kacang_tanah_produksi ? 'border-red-500' : ''}`}
                />
                {errors.kacang_tanah_produksi && (
                  <HelperError>{errors.kacang_tanah_produksi.message}</HelperError>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Button */}
        <div className="flex justify-end gap-3">
          <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            Batal
          </Link>
          <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
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

export default EditPalawija1Page