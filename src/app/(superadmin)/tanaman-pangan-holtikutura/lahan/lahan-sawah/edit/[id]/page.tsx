"use client";
import Label from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import HelperError from "@/components/ui/HelperError";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import KecValue from "@/components/superadmin/SelectComponent/KecamatanValue";
import Loading from "@/components/ui/Loading";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR from "swr";

interface LahanSawahResponse {
  status: number;
  message: string;
  data: LahanSawahData;
}

interface LahanSawahData {
  id: number;
  tphLahanSawahId: number;
  kecamatanId: number;
  irigasiTeknis: number;
  irigasiSetengahTeknis: number;
  irigasiSederhana: number;
  irigasiDesa: number;
  tadahHujan: number;
  pasangSurut: number;
  lebak: number;
  lainnya: number;
  jumlah: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
  tphLahanSawah: TphLahanSawah;
  kecamatan: Kecamatan;
}

interface TphLahanSawah {
  id: number;
  tahun: number;
  createdAt: string;
  updatedAt: string;
}

interface Kecamatan {
  id: number;
  nama: string;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z.object({
  irigasi_teknis: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  irigasi_setengah_teknis: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  irigasi_sederhana: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  irigasi_desa: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  tadah_hujan: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  pasang_surut: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  lebak: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  lainnya: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().optional()),
  keterangan: z.string().min(0, { message: "keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditLahanSawahPage = () => {
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { id } = params;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const { data: dataLahanSawah, error } = useSWR<LahanSawahResponse>(
    `tph/lahan-sawah/get/${id}`,
    async (url: string) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
      }
    }
  );

  useEffect(() => {
    if (dataLahanSawah && dataLahanSawah.data) {
      const {
        kecamatanId,
        tphLahanSawah: { tahun },
        irigasiTeknis,
        irigasiSetengahTeknis,
        irigasiSederhana,
        irigasiDesa,
        tadahHujan,
        pasangSurut,
        lebak,
        lainnya,
        keterangan,
      } = dataLahanSawah.data;

      // Set the form values with fetched data
      setValue("irigasi_teknis", irigasiTeknis);
      setValue("irigasi_setengah_teknis", irigasiSetengahTeknis);
      setValue("irigasi_sederhana", irigasiSederhana);
      setValue("irigasi_desa", irigasiDesa);
      setValue("tadah_hujan", tadahHujan);
      setValue("pasang_surut", pasangSurut);
      setValue("lebak", lebak);
      setValue("lainnya", lainnya);
      setValue("keterangan", keterangan);
    }
  }, [dataLahanSawah, setValue]);
  const [activeTab, setActiveTab] = useState("lahanSawah");


  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    try {
      await axiosPrivate.put(`/tph/lahan-sawah/update/${id}`, data);
      localStorage.setItem('activeTab', activeTab);


      Swal.fire({
        icon: "success",
        title: "Data berhasil diperbarui!",
        text: "Data sudah disimpan dalam sistem!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate.push("/tanaman-pangan-holtikutura/lahan");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.data?.[0]?.message || "Gagal memperbarui data!";
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan!",
        text: errorMessage,
        showConfirmButton: true,
      });
      console.error("Failed to create user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data Lahan Sawah</div>
      {/* Nama NIP Tempat Tanggal Lahir */}
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-[70vh] flex flex-col justify-between">
        <div className="wrap-form">
          <div className="mb-2">
            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Tahun" />
                <Input
                  autoFocus
                  type="number"
                  placeholder="Tahun"
                  value={dataLahanSawah?.data.tphLahanSawah.tahun.toString()}
                  disabled
                />
              </div>
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                <KecValue
                  disabled
                  value={dataLahanSawah?.data.kecamatanId}
                  onChange={() => { }} // Empty function for onChange
                />
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
          <Link href="/tanaman-pangan-holtikutura/lahan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
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

export default EditLahanSawahPage