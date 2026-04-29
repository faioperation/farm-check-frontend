import React from 'react'

const InputField = ({
  label,
  className,
  placeholder,
  inputClass,
  labelClass,
  value,
  onChange,
  type,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      <label className={`font-inter  text-[#364153]  ${labelClass}`}>
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}           
        onChange={onChange}     
        className={`border border-[#D1D5DC]  outline-none p-4 text-[#364153] placeholder:text-[#0A0A0A]/50 rounded-2xl ${inputClass}`}
        {...props}
      />
    </div>
  );
}

export default InputField;

{/* <InputField                 
                // readOnly={true}
                inputClass={`rounded-lg`}
                label={`Question 3`}
                placeholder={`What's your timeline for getting started?`}
              /> */}