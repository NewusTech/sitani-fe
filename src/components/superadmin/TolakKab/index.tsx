"use client";
import React, { FC, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import TolakIcon from '../../../../public/icons/TolakIcon';
import { Textarea } from '@/components/ui/textarea';

interface VerifikasiPopupProps {
    kecamatanId: number; // kecamatan_id untuk API
    triwulan: string; // triwulan untuk API
    tahun: string; // triwulan untuk API
    onTolak: (payload: { kecamatan_id: number; triwulan: string; tahun: string; status: string; keterangan: string; }) => Promise<void>; // API function
}

const TolakTPH: FC<VerifikasiPopupProps> = ({ kecamatanId, triwulan, onTolak, tahun }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alasan, setAlasan] = useState('');

    const handleReject = async () => {
        setLoading(true);
        const payload = {
            kecamatan_id: kecamatanId,
            triwulan: triwulan, // format triwulan, e.g., "2024/5"
            tahun: tahun, // format triwulan, e.g., "2024/5"
            status: 'tolak',
            keterangan: alasan, // alasan penolakan dari user
        };

        try {
            await onTolak(payload); // Mengirim payload ke API
            setAlasan(''); // Reset alasan setelah berhasil
        } catch (error) {
            console.error("Penolakan gagal:", error);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <div title='Tolak Validasi' className='flex'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button onClick={() => setIsOpen(true)}>
                        <TolakIcon />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-start'>
                            Apakah kamu yakin ingin menolak verifikasi data ini?
                        </DialogTitle>
                        <DialogDescription className='text-start'>
                            Mohon masukkan alasan penolakan:
                            <Textarea
                                className='placeholder:text-gray-400 h-[150px] mt-2 p-3'
                                placeholder="Tuliskan alasan penolakan"
                                value={alasan}
                                onChange={(e) => setAlasan(e.target.value)}
                            />
                            <div className="wrap flex gap-3 justify-end mt-3">
                                <Button
                                    type='button'
                                    variant="outlinePrimary"
                                    className='w-[100px]'
                                    onClick={() => setIsOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className={`w-[100px] ${loading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-700'}`}
                                    onClick={handleReject}
                                    disabled={loading || !alasan} // Disable button if loading or no reason provided
                                >
                                    {loading ? <Loading /> : "Tolak"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TolakTPH;
