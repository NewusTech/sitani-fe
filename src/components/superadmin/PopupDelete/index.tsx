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
import HapusIcon from '../../../../public/icons/HapusIcon';
import { Button } from '@/components/ui/button';

interface DeletePopupProps {
    onDelete: () => void; // Menentukan tipe untuk onDelete sebagai fungsi yang tidak mengembalikan apa pun (void)
}

const DeletePopup: FC<DeletePopupProps> = ({ onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        if (onDelete) {
            onDelete(); // Memanggil fungsi yang diberikan sebagai props untuk melakukan tindakan penghapusan
        }
        setIsOpen(false); // Menutup dialog setelah menghapus
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button onClick={() => setIsOpen(true)}>
                        <HapusIcon />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Apakah kamu yakin menghapus ini?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan membuat data hilang permanen dan akan dihapus di server
                            <div className="wrap flex gap-3 justify-end mt-3">
                                <Button 
                                    type='button' 
                                    variant="outlinePrimary" 
                                    className='w-[100px]'
                                    onClick={() => setIsOpen(false)} // Menutup dialog
                                >
                                    Batal
                                </Button>
                                <Button 
                                    className='bg-red-500 w-[100px]' 
                                    onClick={handleDelete} // Menambahkan fungsi onClick
                                >
                                    Hapus
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DeletePopup;
