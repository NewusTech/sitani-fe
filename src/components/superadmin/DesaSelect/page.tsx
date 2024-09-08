// components/SelectMultipleDesa.tsx
import React from 'react';
import Select, { MultiValue } from 'react-select';

interface DesaOption {
  id: number;
  nama: string;
  kecamatanId: number;
}

interface SelectMultipleDesaProps {
  desaOptions: DesaOption[];
  selectedDesa: DesaOption[];
  onChange: (selected: DesaOption[]) => void;
}

const SelectMultipleDesa: React.FC<SelectMultipleDesaProps> = ({
  desaOptions,
  selectedDesa,
  onChange,
}) => {
  const handleSelectChange = (selected: MultiValue<{ value: number; label: string }>) => {
    const selectedDesaList = selected
      ? desaOptions.filter((desa) => selected.some((s) => s.value === desa.id))
      : [];
    onChange(selectedDesaList);
  };

  // Map options to react-select format
  const options = desaOptions.map((desa) => ({
    value: desa.id,
    label: desa.nama,
  }));

  // Find selected options by matching ids
  const selectedOptions = selectedDesa.map((desa) => ({
    value: desa.id,
    label: desa.nama,
  }));

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleSelectChange}
      className="w-full"
      classNamePrefix="react-select"
      placeholder="Pilih Desa"
    />
  );
};

export default SelectMultipleDesa;
