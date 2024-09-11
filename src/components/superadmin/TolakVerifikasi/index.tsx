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
    onTolak: (alasan: string) => Promise<void>; // onTolak should return a promise
}

const TolakPopup: FC<VerifikasiPopupProps> = ({ onTolak }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alasan, setAlasan] = useState('');

    const handleReject = async () => {
        setLoading(true);
        try {
            await onTolak(alasan); // Wait for the reject action to complete
        } catch (error) {
            console.error("Penolakan gagal:", error);
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <div title='Tolak Verifikasi' className='flex'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button onClick={() => setIsOpen(true)}>
                        <TolakIcon />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Apakah kamu yakin ingin menolak verifikasi data ini?
                        </DialogTitle>
                        <DialogDescription>
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
                                    disabled={loading || !alasan} // Disable button while loading or if no reason is provided
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
}

export default TolakPopup;
