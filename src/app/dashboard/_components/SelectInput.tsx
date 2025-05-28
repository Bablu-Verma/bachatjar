import React from 'react'

interface SelectProps {
    id: string; 
    options: string[]; 
    defaultValue: string; 
    onChange: (value: string) => void; 
    className?: string;
  }
const SelectInput :React.FC<SelectProps> = ({ id, options, defaultValue, onChange, className }) => {
    return (
        <select
          id={id}
          className={className}
          onChange={(e) => onChange(e.target.value)} 
          defaultValue={defaultValue} 
        >
          <option value="none" disabled>
            {defaultValue}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
}

export default SelectInput