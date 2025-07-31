import { Input as MTInput, Typography } from "@material-tailwind/react";
import React from "react";

type CustomInputProps = {
  label?: string;
  placeholder?: string;
  subLabel?: string;
  maxLength?: number;
  value?: string;
  name?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({
  label,
  placeholder,
  subLabel,
  value,
  name,
  error,
  onChange,
}: CustomInputProps) {
  return (
    <div className="w-full">
      {label && (
        <Typography
          variant="small"
          color={error ? "red" : "blue-gray"}
          className="mb-1 font-medium"
        >
          {label}
        </Typography>
      )}
      <MTInput
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`appearance-none !border-t-blue-gray-200 placeholder:text-blue-gray-300 placeholder:opacity-100 focus:!border-t-gray-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          error ? "!border-red-500 focus:!border-red-500" : ""
        }`}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        error={!!error}
      />
      {error && (
        <Typography className="mt-1 text-xs font-normal text-red-500">
          {error}
        </Typography>
      )}
      {subLabel && !error && (
        <Typography className="mt-2 text-xs font-normal text-blue-gray-500">
          {subLabel}
        </Typography>
      )}
    </div>
  );
}
