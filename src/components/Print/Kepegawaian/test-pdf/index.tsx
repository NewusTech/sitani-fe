"use client"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";

interface Data {
    id?: number;
    nama?: string;
    nip?: string;
    tempatLahir?: string;
    tglLahir?: string;
    pangkat?: string;
    golongan?: string;
    tmtPangkat?: string;
    jabatan?: string;
    tmtJabatan?: string;
    namaDiklat?: string;
    tglDiklat?: string;
    totalJam?: number;
    namaPendidikan?: string;
    tahunLulus?: number;
    jenjangPendidikan?: string;
    usia?: string;
    masaKerja?: string;
    keterangan?: string;
    status?: string;
    bidang_id?: number;
    bidang?: { id?: number; nama?: string };
}

interface PdfGeneratorProps {
    data: Data[];
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ data }) => {
    const generatePdf = async () => {
        const doc = new jsPDF("p", "pt", "a4");
        const content = document.getElementById("pdf-content");

        if (content) {
            const canvas = await html2canvas(content);
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 595.28; // A4 width in pt
            const pageHeight = 841.89; // A4 height in pt
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            doc.save("data-pegawai.pdf");
        }
    };

    return (
        <div>
            <div id="pdf-content">
                <table className="border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden">
                    <thead className="bg-primary-600">
                        <tr>
                            <th className="text-primary py-1 border border-slate-200 text-center">Nama</th>
                            <th className="text-primary py-1 border border-slate-200 text-center">NIP</th>
                            <th className="text-primary py-1 border border-slate-200 text-center">Jabatan</th>
                            <th className="text-primary py-1 border border-slate-200 text-center">Pangkat</th>
                            <th className="">Golongan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="py-2 lg:py-4 border border-slate-200">{item.nama}</td>
                                <td className="py-2 lg:py-4 border border-slate-200">{item.nip}</td>
                                <td className="py-2 lg:py-4 border border-slate-200">{item.jabatan}</td>
                                <td className="py-2 lg:py-4 border border-slate-200">{item.pangkat}</td>
                                <td className="">{item.golongan}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={generatePdf} className="btn-export">
                Export to PDF
            </button>
        </div>
    );
};

export default PdfGenerator;
