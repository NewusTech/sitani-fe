// DownloadPDF.tsx
"use client";
import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import library autoTable

interface DownloadPDFProps {
    data: any; // Ganti dengan tipe data yang lebih tepat jika perlu
}

const DownloadPDF: React.FC<DownloadPDFProps> = ({ data }) => {
    const handleDownloadPDF = () => {
        // Pastikan data tersedia
        if (!data || !data.data) {
            console.error('Data tidak tersedia untuk diunduh.');
            return;
        }

        const detail = data.data.detail;
        const list = detail.list;

        // Inisialisasi total
        let totalJagungPanen = 0;
        let totalJagungProduktivitas = 0;
        let totalJagungProduksi = 0;
        let totalKedelaiPanen = 0;
        let totalKedelaiProduktivitas = 0;
        let totalKedelaiProduksi = 0;
        let totalKacangTanahPanen = 0;
        let totalKacangTanahProduktivitas = 0;
        let totalKacangTanahProduksi = 0;

        // Hitung total untuk setiap jenis
        list.forEach((item: any) => {
            totalJagungPanen += item.jagungPanen || 0;
            totalJagungProduktivitas += item.jagungProduktivitas || 0;
            totalJagungProduksi += item.jagungProduksi || 0;
            totalKedelaiPanen += item.kedelaiPanen || 0;
            totalKedelaiProduktivitas += item.kedelaiProduktivitas || 0;
            totalKedelaiProduksi += item.kedelaiProduksi || 0;
            totalKacangTanahPanen += item.kacangTanahPanen || 0;
            totalKacangTanahProduktivitas += item.kacangTanahProduktivitas || 0;
            totalKacangTanahProduksi += item.kacangTanahProduksi || 0;
        });

        // Membuat dokumen PDF baru dengan orientasi portrait
        const doc = new jsPDF('landscape');
        const margin = 10;
        const titleFontSize = 16;
        const contentFontSize = 12;

        // Fungsi Styling untuk Judul
        const addTitle = (title: string, yPosition: number) => {
            doc.setFontSize(titleFontSize);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, yPosition);
        };

        // Tambahkan Judul Dokumen
        addTitle('Laporan Realisasi Palawija', margin + 10);

        doc.setFontSize(contentFontSize);
        doc.setFont('helvetica', 'normal');

        // Header tabel
        const headers = [['No', 'Kecamatan', 'Jagung Panen (ha)', 'Jagung Produktivitas (ku/ha)', 'Jagung Produksi (ton)', 'Kedelai Panen (ha)', 'Kedelai Produktivitas (ku/ha)', 'Kedelai Produksi (ton)', 'Kacang Tanah Panen (ha)', 'Kacang Tanah Produktivitas (ku/ha)', 'Kacang Tanah Produksi (ton)']];

        // Data tabel
        const tableData = list.map((item: {
            kecamatan: { nama: string };
            jagungPanen: string;
            jagungProduktivitas: string;
            jagungProduksi: string;
            kedelaiPanen: string;
            kedelaiProduktivitas: string;
            kedelaiProduksi: string;
            kacangTanahPanen: string;
            kacangTanahProduktivitas: string;
            kacangTanahProduksi: string;
        }, index: number) => [
                index + 1,
                item.kecamatan.nama,
                item.jagungPanen ?? '-',
                item.jagungProduktivitas ?? '-',
                item.jagungProduksi ?? '-',
                item.kedelaiPanen ?? '-',
                item.kedelaiProduktivitas ?? '-',
                item.kedelaiProduksi ?? '-',
                item.kacangTanahPanen ?? '-',
                item.kacangTanahProduktivitas ?? '-',
                item.kacangTanahProduksi ?? '-',
            ]);

        // Tambahkan total sebagai baris terakhir
        const totalRow = [
            '',
            'Total',
            totalJagungPanen,
            totalJagungProduktivitas,
            totalJagungProduksi,
            totalKedelaiPanen,
            totalKedelaiProduktivitas,
            totalKedelaiProduksi,
            totalKacangTanahPanen,
            totalKacangTanahProduktivitas,
            totalKacangTanahProduksi,
        ];

        // Membuat tabel dengan autoTable
        const allData = [...tableData, totalRow]; // Gabungkan data dan total

        doc.autoTable({
            startY: margin + 40, // Mulai setelah judul
            head: headers,
            body: allData,
            theme: 'grid', // Tema grid untuk tampilan tabel
            headStyles: {
                fillColor: [240, 240, 240], // Warna header tabel (abu-abu terang)
                textColor: [0, 0, 0], // Warna teks hitam
                fontStyle: 'bold',
                lineWidth: 0.5,
                lineColor: [0, 0, 0], // Warna garis border hitam
            },
            bodyStyles: {
                fillColor: [255, 255, 255], // Warna background body baris (putih)
                textColor: [0, 0, 0], // Warna teks hitam
                lineWidth: 0.5,
                lineColor: [0, 0, 0], // Warna garis border hitam
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245], // Warna background baris genap (abu-abu muda)
            },
            margin: { top: 10, bottom: 10 },
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
        });

        // Simpan PDF
        doc.save('realisasi-palawija.pdf');
    };

    return (
        <button
            onClick={handleDownloadPDF}
            className=""
        >
            Download PDF
        </button>
    );
};

export default DownloadPDF;
