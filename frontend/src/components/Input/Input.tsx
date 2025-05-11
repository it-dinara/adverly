import React from "react";

interface InputProps {
  label?: string;
  type: string;
  name: string;
  value: string | number;
  placeholder?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;
