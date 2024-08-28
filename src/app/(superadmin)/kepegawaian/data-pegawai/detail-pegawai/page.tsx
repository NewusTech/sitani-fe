import React from 'react'
import AlertIcon from '../../../../../../public/icons/AlertIcon'

interface LabelProps {
  label?: string;
  name?: string;
}

const LabelDetail = (props: LabelProps) => {
  return (
    <div>
      <div className="label font-semibold">{props.label || '-'}</div>
      <div className="name text-black/70">{props.name || '-'}</div>
    </div>
  )
}

const DetailPegawaiPage = () => {
  return (
    <div>
      {/* title */}
      <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Data Pegawai</div>
      {/* title */}
      {/* alert */}
      <div className="p-3 border border-red-400 rounded-md bg-red-100">
        <div className="text-red-600 flex gap-2 items-center">
          <AlertIcon />
          Data pegawai sudah mendekati masa pensiun
        </div>
      </div>
      {/* alert */}
      {/* detail */}
      <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
        <div className="font-semibold mb-2 text-lg uppercase">Data Pegawai</div>
        <div className="grid grid-cols-2 gap-3">
          <LabelDetail label='Name' name='John Dea' />
          <LabelDetail label='NIP' name='1345435345' />
          <LabelDetail label='Tempat' name='Jakarta' />
          <LabelDetail label='Tanggal Lahir' name='1990-01-01' />
          <LabelDetail label='Pangkat/Gol Ruang' name='Pembina Utama IV/a' />
          <LabelDetail label='TMT Pangkat' name='2023-01-01' />
          <LabelDetail label='Jabatan' name='Ahli Utama' />
          <LabelDetail label='TMT Jabatan' name='2023-01-01' />
          <LabelDetail label='Usia' name='34' />
          <LabelDetail label='Masa Kerja' name='12 Tahun' />
          <LabelDetail label='Keterangan' name='PNS' />
        </div>
        <div className="wr">
          <div className="font-semibold mb-2 text-lg mt-5 uppercase">Diklat Struktural</div>
          <div className="grid grid-cols-2 gap-3">
            <LabelDetail label='Name' name='John Dea' />
            <LabelDetail label='NIP' name='1345435345' />
            <LabelDetail label='Tempat' name='Jakarta' />
          </div>
        </div>
        <div className="wr">
          <div className="font-semibold text-lg mb-2 mt-5 uppercase">Pendidikan Umum</div>
          <div className="grid grid-cols-2 gap-3">
            <LabelDetail label='Nama' name='Agronomi' />
            <LabelDetail label='Tahun Lulus' name='1345435345' />
            <LabelDetail label='Jenjang' name='Sarjana' />
          </div>
        </div>
      </div>
      {/* detail */}
    </div>
  )
}

export default DetailPegawaiPage