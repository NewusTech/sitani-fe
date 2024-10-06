import React from 'react';
import Select, { MultiValue } from 'react-select';

// Define the structure of the options for Kecamatan
interface KecamatanOption {
  id: number;
  permissionName: string;
}

// Define the props for the SelectMultipleHak component
interface SelectMultipleHakProps {
  placeholder?: string;
  kecamatanOptions: KecamatanOption[];
  selectedKecamatan: KecamatanOption[];
  onChange: (selected: KecamatanOption[]) => void;
}

// Component implementation
const SelectMultipleHak: React.FC<SelectMultipleHakProps> = ({
  kecamatanOptions,
  placeholder="Pilih Kecamatan",
  selectedKecamatan,
  onChange,
}) => {
  // Handle changes in selection
  const handleSelectChange = (selected: MultiValue<{ value: number; label: string; }>) => {
    const selectedKecamatanList = selected
      ? kecamatanOptions.filter((kecamatan) => selected.some((s) => s.value === kecamatan.id))
      : [];
    onChange(selectedKecamatanList);
  };

  // Map options to react-select format
  const options = kecamatanOptions.map((kecamatan) => ({
    value: kecamatan.id,
    label: kecamatan.permissionName,
  }));

  // Map selected options to react-select format
  const selectedOptions = selectedKecamatan.map((kecamatan) => ({
    value: kecamatan.id,
    label: kecamatan.permissionName,
  }));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleSelectChange}
      className="w-full"
      classNamePrefix="react-select"
      placeholder={placeholder}
    />
  );
};

export default SelectMultipleHak;
