// "use client"

// import React, { useState } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import useAxiosPrivate from '@/hooks/useAxiosPrivate';
// import { useRouter } from 'next/navigation';
// import useSWR, { SWRResponse, mutate } from "swr";

// // Define type for form data
// type FormData = {
//     kecamatan_id: number;
//     desa_id: number;
//     tanggal: string;
//     korluh_master_palawija_id: number;
//     lahan_sawah_panen?: number;
//     lahan_sawah_panen_muda?: number;
//     lahan_sawah_panen_hijauan_pakan_ternak?: number;
//     lahan_sawah_tanam?: number;
//     lahan_sawah_puso?: number;
//     lahan_bukan_sawah_panen?: number;
//     lahan_bukan_sawah_panen_muda?: number;
//     lahan_bukan_sawah_panen_hijauan_pakan_ternak?: number;
//     lahan_bukan_sawah_tanam?: number;
//     lahan_bukan_sawah_puso?: number;
// };

// const korluhMasterPalawijaData = [
//     {
//         id: 1,
//         nama: 'JUMLAH JAGUNG',
//         anak: [
//             {
//                 id: 12,
//                 nama: 'Hibrida',
//                 anak: [
//                     { id: 15, nama: 'Bantuan Pemerintah' },
//                     { id: 16, nama: 'Non Bantuan Pemerintah' },
//                 ],
//             },
//             { id: 13, nama: 'Komposit', anak: [] },
//             { id: 14, nama: 'Lokal', anak: [] },
//         ],
//     },
//     {
//         id: 2,
//         nama: 'KEDELAI',
//         anak: [
//             { id: 17, nama: 'Bantuan Pemerintah', anak: [] },
//             { id: 18, nama: 'Non Bantuan Pemerintah', anak: [] },
//         ],
//     },
//     {
//         id: 22,
//         nama: 'JUMLAH TEBU',
//         anak: [],
//     },
//     // Add more data as needed...
// ];


// // Fungsi untuk format tanggal ke 'YYYY-MM-DD'
// const formatDateToday = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// };

// const today = formatDateToday(new Date());

// const CreatePage: React.FC = () => {
//     const { register, handleSubmit, setValue, } = useForm<FormData>({
//         defaultValues: {
//             kecamatan_id: 0,
//             desa_id: 0,
//             tanggal: today,
//             korluh_master_palawija_id: 0,
//         },
//     });

//     const [selectedKorluh, setSelectedKorluh] = useState<number | null>(null);
//     const [selectedAnak, setSelectedAnak] = useState<number | null>(null);
//     const [selectedSubAnak, setSelectedSubAnak] = useState<number | null>(null);

//     const handleKorluhChange = (korluhId: number) => {
//         setSelectedKorluh(korluhId);
//         setSelectedAnak(null);
//         setSelectedSubAnak(null);
//         setValue('korluh_master_palawija_id', korluhId); // Set initial value to the selected master
//     };

//     const handleAnakChange = (anakId: number) => {
//         setSelectedAnak(anakId);
//         setSelectedSubAnak(null);
//         setValue('korluh_master_palawija_id', anakId); // Update to anak id
//     };

//     const handleSubAnakChange = (subAnakId: number) => {
//         setSelectedSubAnak(subAnakId);
//         setValue('korluh_master_palawija_id', subAnakId); // Update to sub anak id
//     };

//     // const onSubmit: SubmitHandler<FormData> = async (data) => {
//     //     // Convert the tanggal field to the desired format
//     //     const formatDate = (date: string | Date) => {
//     //         const d = new Date(date);
//     //         const year = d.getFullYear();
//     //         const month = d.getMonth() + 1; // Months are zero-based
//     //         const day = d.getDate();
//     //         return `${year}/${month}/${day}`;
//     //     };

//     //     const formData = {
//     //         ...data,
//     //         tanggal: formatDate(data.tanggal),
//     //         kecamatan_id: Number(data.kecamatan_id),
//     //         desa_id: Number(data.desa_id),
//     //         korluh_master_palawija_id: Number(data.korluh_master_palawija_id),
//     //         lahan_sawah_panen: data.lahan_sawah_panen ? Number(data.lahan_sawah_panen) : undefined,
//     //         lahan_sawah_panen_muda: data.lahan_sawah_panen_muda ? Number(data.lahan_sawah_panen_muda) : undefined,
//     //         lahan_sawah_panen_hijauan_pakan_ternak: data.lahan_sawah_panen_hijauan_pakan_ternak ? Number(data.lahan_sawah_panen_hijauan_pakan_ternak) : undefined,
//     //         lahan_sawah_tanam: data.lahan_sawah_tanam ? Number(data.lahan_sawah_tanam) : undefined,
//     //         lahan_sawah_puso: data.lahan_sawah_puso ? Number(data.lahan_sawah_puso) : undefined,
//     //         lahan_bukan_sawah_panen: data.lahan_bukan_sawah_panen ? Number(data.lahan_bukan_sawah_panen) : undefined,
//     //         lahan_bukan_sawah_panen_muda: data.lahan_bukan_sawah_panen_muda ? Number(data.lahan_bukan_sawah_panen_muda) : undefined,
//     //         lahan_bukan_sawah_panen_hijauan_pakan_ternak: data.lahan_bukan_sawah_panen_hijauan_pakan_ternak ? Number(data.lahan_bukan_sawah_panen_hijauan_pakan_ternak) : undefined,
//     //         lahan_bukan_sawah_tanam: data.lahan_bukan_sawah_tanam ? Number(data.lahan_bukan_sawah_tanam) : undefined,
//     //         lahan_bukan_sawah_puso: data.lahan_bukan_sawah_puso ? Number(data.lahan_bukan_sawah_puso) : undefined,
//     //     };

//     //     console.log(formData);
//     // };

//     // TAMBAH
//     const [loading, setLoading] = useState(false);
//     const axiosPrivate = useAxiosPrivate();
//     const navigate = useRouter();

//     const onSubmit: SubmitHandler<FormData> = async (data) => {
//         // Convert the tanggal field to the desired format
//         const formatDate = (date: string | Date) => {
//             const d = new Date(date);
//             const year = d.getFullYear();
//             const month = d.getMonth() + 1; // Months are zero-based
//             const day = d.getDate();
//             return `${year}/${month}/${day}`;
//         };

//         const formData = {
//             ...data,
//             tanggal: formatDate(data.tanggal),
//             kecamatan_id: Number(data.kecamatan_id),
//             desa_id: Number(data.desa_id),
//             korluh_master_palawija_id: Number(data.korluh_master_palawija_id),
//             lahan_sawah_panen: data.lahan_sawah_panen ? Number(data.lahan_sawah_panen) : undefined,
//             lahan_sawah_panen_muda: data.lahan_sawah_panen_muda ? Number(data.lahan_sawah_panen_muda) : undefined,
//             lahan_sawah_panen_hijauan_pakan_ternak: data.lahan_sawah_panen_hijauan_pakan_ternak ? Number(data.lahan_sawah_panen_hijauan_pakan_ternak) : undefined,
//             lahan_sawah_tanam: data.lahan_sawah_tanam ? Number(data.lahan_sawah_tanam) : undefined,
//             lahan_sawah_puso: data.lahan_sawah_puso ? Number(data.lahan_sawah_puso) : undefined,
//             lahan_bukan_sawah_panen: data.lahan_bukan_sawah_panen ? Number(data.lahan_bukan_sawah_panen) : undefined,
//             lahan_bukan_sawah_panen_muda: data.lahan_bukan_sawah_panen_muda ? Number(data.lahan_bukan_sawah_panen_muda) : undefined,
//             lahan_bukan_sawah_panen_hijauan_pakan_ternak: data.lahan_bukan_sawah_panen_hijauan_pakan_ternak ? Number(data.lahan_bukan_sawah_panen_hijauan_pakan_ternak) : undefined,
//             lahan_bukan_sawah_tanam: data.lahan_bukan_sawah_tanam ? Number(data.lahan_bukan_sawah_tanam) : undefined,
//             lahan_bukan_sawah_puso: data.lahan_bukan_sawah_puso ? Number(data.lahan_bukan_sawah_puso) : undefined,
//         };

//         // setLoading(true); // Set loading to true when the form is submitted
//         try {
//             // await axiosPrivate.post("/korluh/palawija/create", formData);
//             console.log(formData)
//             // push
//             // navigate.push('/bpp-kecamatan');
//             console.log("Success to create user:");
//             // reset()
//         } catch (e: any) {
//             console.log(data)
//             console.log("Failed to create user:");
//             return;
//         } finally {
//             // setLoading(false); // Set loading to false once the process is complete
//         }
//         mutate(`/korluh/palawija/get`);
//     };
//     //   const onSubmit: SubmitHandler<FormData> = async (data) => {
//     //     const formData = { ...data }; // `data` is the form data without `anak_id` and `sub_anak_id`

//     //     try {
//     //       await axios.post('/api/create', formData);
//     //       alert('Data submitted successfully');
//     //     } catch (error) {
//     //       console.error('Error submitting form:', error);
//     //     }
//     //   };

//     return (
//         <div className="container mx-auto p-8">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* Kecamatan, Desa, and Tanggal Fields */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="flex flex-col">
//                         <label htmlFor="kecamatan_id" className="text-lg font-medium">Kecamatan:</label>
//                         <input
//                             type="number"
//                             id="kecamatan_id"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('kecamatan_id', { required: 'Kecamatan is required' })}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="desa_id" className="text-lg font-medium">Desa:</label>
//                         <input
//                             type="number"
//                             id="desa_id"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('desa_id', { required: 'Desa is required' })}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="tanggal" className="text-lg font-medium">Tanggal:</label>
//                         <input
//                             type="date"
//                             id="tanggal"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('tanggal', { required: 'Tanggal is required' })}
//                         />
//                     </div>
//                 </div>

//                 {/* Select Inputs for Korluh and Anak */}
//                 <div className="flex flex-col">
//                     <label htmlFor="korluh_master_palawija_id" className="text-lg font-medium">Korluh Master Palawija:</label>
//                     <select
//                         id="korluh_master_palawija_id"
//                         className="border border-gray-300 p-2 rounded"
//                         onChange={(e) => handleKorluhChange(Number(e.target.value))}
//                     >
//                         <option value="">Select Master</option>
//                         {korluhMasterPalawijaData.map((korluh) => (
//                             <option key={korluh.id} value={korluh.id}>
//                                 {korluh.nama}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {selectedKorluh !== null && korluhMasterPalawijaData?.find((k) => k.id === selectedKorluh)?.anak.length > 0 && (
//                     <div className="flex flex-col">
//                         <label htmlFor="anak_id" className="text-lg font-medium">Anak:</label>
//                         <select
//                             id="anak_id"
//                             className="border border-gray-300 p-2 rounded"
//                             onChange={(e) => handleAnakChange(Number(e.target.value))}
//                         >
//                             <option value="">Select Anak</option>
//                             {korluhMasterPalawijaData.find((k) => k.id === selectedKorluh)?.anak.map((anak) => (
//                                 <option key={anak.id} value={anak.id}>
//                                     {anak.nama}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {selectedAnak !== null && korluhMasterPalawijaData?.find((k) => k.id === selectedKorluh)?.anak.find((a) => a.id === selectedAnak)?.anak.length > 0 && (
//                     <div className="flex flex-col">
//                         <label htmlFor="sub_anak_id" className="text-lg font-medium">Sub Anak:</label>
//                         <select
//                             id="sub_anak_id"
//                             className="border border-gray-300 p-2 rounded"
//                             onChange={(e) => handleSubAnakChange(Number(e.target.value))}
//                         >
//                             <option value="">Select Sub Anak</option>
//                             {korluhMasterPalawijaData.find((k) => k.id === selectedKorluh)?.anak.find((a) => a.id === selectedAnak)?.anak.map((subAnak) => (
//                                 <option key={subAnak.id} value={subAnak.id}>
//                                     {subAnak.nama}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}

//                 {/* Other Fields */}
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_sawah_panen" className="text-lg font-medium">Lahan Sawah Panen:</label>
//                         <input
//                             type="number"
//                             id="lahan_sawah_panen"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_sawah_panen')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_sawah_panen_muda" className="text-lg font-medium">Lahan Sawah Panen Muda:</label>
//                         <input
//                             type="number"
//                             id="lahan_sawah_panen_muda"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_sawah_panen_muda')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_sawah_panen_hijauan_pakan_ternak" className="text-lg font-medium">Lahan Sawah Panen Hijauan Pakan Ternak:</label>
//                         <input
//                             type="number"
//                             id="lahan_sawah_panen_hijauan_pakan_ternak"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_sawah_panen_hijauan_pakan_ternak')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_sawah_tanam" className="text-lg font-medium">Lahan Sawah Tanam:</label>
//                         <input
//                             type="number"
//                             id="lahan_sawah_tanam"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_sawah_tanam')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_sawah_puso" className="text-lg font-medium">Lahan Sawah Puso:</label>
//                         <input
//                             type="number"
//                             id="lahan_sawah_puso"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_sawah_puso')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_bukan_sawah_panen" className="text-lg font-medium">Lahan Bukan Sawah Panen:</label>
//                         <input
//                             type="number"
//                             id="lahan_bukan_sawah_panen"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_bukan_sawah_panen')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_bukan_sawah_panen_muda" className="text-lg font-medium">Lahan Bukan Sawah Panen Muda:</label>
//                         <input
//                             type="number"
//                             id="lahan_bukan_sawah_panen_muda"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_bukan_sawah_panen_muda')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_bukan_sawah_panen_hijauan_pakan_ternak" className="text-lg font-medium">Lahan Bukan Sawah Panen Hijauan Pakan Ternak:</label>
//                         <input
//                             type="number"
//                             id="lahan_bukan_sawah_panen_hijauan_pakan_ternak"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_bukan_sawah_panen_hijauan_pakan_ternak')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_bukan_sawah_tanam" className="text-lg font-medium">Lahan Bukan Sawah Tanam:</label>
//                         <input
//                             type="number"
//                             id="lahan_bukan_sawah_tanam"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_bukan_sawah_tanam')}
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label htmlFor="lahan_bukan_sawah_puso" className="text-lg font-medium">Lahan Bukan Sawah Puso:</label>
//                         <input
//                             type="number"
//                             id="lahan_bukan_sawah_puso"
//                             className="border border-gray-300 p-2 rounded"
//                             {...register('lahan_bukan_sawah_puso')}
//                         />
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                 >
//                     Submit
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default CreatePage;


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
