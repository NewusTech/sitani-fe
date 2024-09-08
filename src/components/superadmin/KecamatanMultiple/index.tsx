import React from 'react';
import Select, { MultiValue } from 'react-select';

// Define the structure of the options for Kecamatan
interface KecamatanOption {
  id: number;
  nama: string;
}

// Define the props for the SelectMultipleKecamatan component
interface SelectMultipleKecamatanProps {
  kecamatanOptions: KecamatanOption[];
  selectedKecamatan: KecamatanOption[];
  onChange: (selected: KecamatanOption[]) => void;
}

// Component implementation
const SelectMultipleKecamatan: React.FC<SelectMultipleKecamatanProps> = ({
  kecamatanOptions,
  selectedKecamatan,
  onChange,
}) => {
  // Handle changes in selection
  const handleSelectChange = (selected: MultiValue<{ value: number; label: string }>) => {
    const selectedKecamatanList = selected
      ? kecamatanOptions.filter((kecamatan) => selected.some((s) => s.value === kecamatan.id))
      : [];
    onChange(selectedKecamatanList);
  };

  // Map options to react-select format
  const options = kecamatanOptions.map((kecamatan) => ({
    value: kecamatan.id,
    label: kecamatan.nama,
  }));

  // Map selected options to react-select format
  const selectedOptions = selectedKecamatan.map((kecamatan) => ({
    value: kecamatan.id,
    label: kecamatan.nama,
  }));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleSelectChange}
      className="w-full"
      classNamePrefix="react-select"
      placeholder="Pilih Kecamatan"
    />
  );
};

export default SelectMultipleKecamatan;
