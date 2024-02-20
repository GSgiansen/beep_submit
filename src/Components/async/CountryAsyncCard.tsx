import React from 'react';
import { CountryData } from '../../CountryData';
import { Checkbox, ListItemText } from '@mui/material';

interface CountryAsyncCardProps {
  country: CountryData;
  onSelect: () => void;
  isSelected: boolean;
  isHighlighted: boolean;
}

function CountryAsyncCard({ country, onSelect, isSelected, isHighlighted }: CountryAsyncCardProps) {
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
      <ListItemText primary={country.emoji +" " + country.currency_name} secondary={country.currency}/>
    </div>
  );
}

export default CountryAsyncCard;
