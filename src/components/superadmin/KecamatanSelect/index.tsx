// components/SelectKecamatan.tsx
import React from 'react';
import Select from 'react-select';

interface KecamatanOption {
  id: number;
  nama: string;
}

interface SelectKecamatanProps {
  kecamatanOptions: KecamatanOption[];
  selectedKecamatan: KecamatanOption | null;
  onChange: (selected: KecamatanOption | null) => void;
}

const SelectKecamatan: React.FC<SelectKecamatanProps> = ({
  kecamatanOptions,
  selectedKecamatan,
  onChange,
}) => {
  // Map options to react-select format
  const options = kecamatanOptions.map((kecamatan) => ({
    value: kecamatan.id,
    label: kecamatan.nama,
  }));

  // Find selected option by matching id
  const selectedOption = selectedKecamatan
    ? { value: selectedKecamatan.id, label: selectedKecamatan.nama }
    : null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selectedOption) =>
        onChange(
          kecamatanOptions.find((kecamatan) => kecamatan.id === selectedOption?.value) || null
        )
      }
      className="w-full"
      classNamePrefix="react-select"
      placeholder="Pilih Kecamatan"
    />
  );
};

export default SelectKecamatan;
