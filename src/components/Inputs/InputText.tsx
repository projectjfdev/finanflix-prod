import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
  register: UseFormRegisterReturn<string>;
  errors: any;
  label?: string;
  placeholder?: string;
  className?: string;
  type: string;
  defaultValue?: any;
  onChange?: (e: any) => any;
  value?: string;
  name?: string;
}

export const InputText = ({
  register,
  errors,
  label,
  type,
  placeholder,
  className,
  defaultValue,
  onChange,
  value,
  name,
}: Props) => {
  return (
    <div className="w-full">
      <div className="py-2 flex flex-col ">
        <Label>{label}</Label>
        <Input
          defaultValue={defaultValue}
          type={type}
          placeholder={placeholder}
          className={`${className} rounded-[13px] dark:bg-[#282844] bg-background`}
          {...register}
          aria-invalid={errors ? 'true' : 'false'}
          onChange={onChange}
          value={value}
          name={name}
        />
      </div>
      {errors && <span className="text-red-600 mb-4">{errors}</span>}
    </div>
  );
};

// 1. Estás usando value y defaultValue a la vez
// Esto vuelve el input un componente controlado y no controlado al mismo tiempo, lo que genera comportamientos inesperados (como ignorar el autoComplete del navegador o que el valor no se refleje en el formulario).

// export const InputText = ({
//   register,
//   errors,
//   label,
//   type,
//   placeholder,
//   className,
// }: Props) => {
//   return (
//     <div className="w-full">
//       <div className="py-2 flex flex-col">
//         <Label>{label}</Label>
//         <Input
//           type={type}
//           placeholder={placeholder}
//           className={`${className} rounded-[13px]`}
//           {...register}
//           aria-invalid={errors ? 'true' : 'false'}
//         />
//       </div>
//       {errors && <span className="text-red-600 mb-4">{errors}</span>}
//     </div>
//   );
// };
