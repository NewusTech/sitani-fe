"use client"
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import UnduhIcon from '../../../../public/icons/UnduhIcon';
import PrintIcon from '../../../../public/icons/PrintIcon';
// 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TesPrint = () => {
  // print
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // download PDF
  const handleDownloadPDF = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('laporan.pdf');
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Halaman Print</h1>
      <div className="btn flex gap-2">
        <Button onClick={handleDownloadPDF} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          <UnduhIcon />
          <div className="hidden md:block">
            Download
          </div>
        </Button>
        <Button onClick={handlePrint} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
          <PrintIcon />
          <div className="hidden md:block">
            Print
          </div>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button onClick={handleDownloadPDF} variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
            <UnduhIcon />
            <div className="hidden md:block">
              Download
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Pilih Unduhan</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleDownloadPDF}>
              Unduh PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              Unduh Excel
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <div className="absolute w-full left-[99999px]"> */}
      <div className="">
        <div ref={printRef} className="">
          {/* <PenyuluhKabupatenPrint /> */}
        </div>
      </div>
    </div>
  )
}

export default TesPrint