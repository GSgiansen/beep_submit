import React from 'react';
import { CountryData } from '../../CountryData';
import { Checkbox, ListItemText } from '@mui/material';

interface CountrySyncCardProps {
  country: CountryData;
  onSelect: () => void;
  isSelected: boolean;
  isHighlighted: boolean;
}

function CountrySyncCard({ country, onSelect, isSelected, isHighlighted }: CountrySyncCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: isHighlighted ? '#bbeeff' : 'transparent',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Checkbox checked={isSelected} onChange={onSelect} />
      <ListItemText primary={country.currency_name}/>

    </div>
  );
}

export default CountrySyncCard;
