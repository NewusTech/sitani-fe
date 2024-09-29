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
import Loading from '@/components/ui/Loading'; // Loading indicator

interface AjukanKembaliProps {
    id: number;
    status: string; // Status seperti 'tolak', 'terima', 'belum', 'tunggu'
    onAjukanKembali: (id: number) => Promise<void>;
}

const AjukanKembali: FC<AjukanKembaliProps> = ({ id, status, onAjukanKembali }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAjukanKembali = async () => {
        setLoading(true);
        try {
            await onAjukanKembali(id); // Panggil API dengan ID
        } catch (error) {
            console.error("Pengajuan kembali gagal:", error);
        } finally {
            setLoading(false);
            setIsOpen(false); // Tutup dialog setelah operasi
        }
    };

    // Kondisi untuk men-disable tombol jika status selain 'tolak'
    const isButtonDisabled = status !== 'tolak';

    return (
        <div title='Ajukan Kembali'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        className={`px-4 py-2 rounded-lg text-white 
                            ${isButtonDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'}`}
                        onClick={() => !isButtonDisabled && setIsOpen(true)}
                        disabled={isButtonDisabled || loading} // Disable tombol jika status bukan 'tolak' atau sedang loading
                    >
                        {loading ? "Loading..." : "Ajukan Kembali"}
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Apakah kamu yakin ingin mengajukan kembali data ini?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan mengajukan kembali data yang telah ditolak. Pastikan data sudah sesuai sebelum melanjutkan.
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
                                    className={`w-[100px] ${loading ? 'bg-gray-500' : 'bg-primary hover:bg-primary-hover'}`}
                                    onClick={handleAjukanKembali}
                                    disabled={loading}
                                >
                                    {loading ? <Loading /> : "Ajukan"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AjukanKembali;
