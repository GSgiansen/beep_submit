import { List, Paper } from "@mui/material";
import { CountryData } from '../../CountryData';
import CountryAsyncCard from "./CountryAsyncCard";
import { useEffect, useRef } from "react";

function AsyncDropdown(props: {
  options: CountryData[];
  selectedCountries: CountryData[];
  onCountrySelect: (selectedCountries: CountryData[]) => void;
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    options,
    onCountrySelect,
    selectedCountries,
    highlightedIndex,
    setHighlightedIndex,
  } = props;
  const listRef = useRef<HTMLUListElement>(null);

  const handleCountrySelect = (country: CountryData) => {
    const updatedSelection = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];

    onCountrySelect(updatedSelection);
  };

  const handleItemClick = (index: number) => {
    setHighlightedIndex(index);
    handleCountrySelect(options[index]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < options.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : options.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        handleCountrySelect(options[highlightedIndex]);
      }
    }
  };

  useEffect(() => {
    const listItem = listRef.current?.querySelector(
      `#country-item-${highlightedIndex}`
    ) as HTMLDivElement | null;
    if (listItem) {
      listItem.focus();
    }
  }, [highlightedIndex]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxHeight: 200,
        overflow: "auto",
        position: "absolute",
        backgroundColor: "white",
        zIndex: 1,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <List ref={listRef} component="ul">
        {options.length === 0 ? (
          <div className="p-8">No results found</div>
        ) : (
          options.map((country, index) => (
            <div
              key={index}
              id={`country-item-${index}`}
              onClick={() => handleItemClick(index)}
              tabIndex={highlightedIndex === index ? 0 : -1}
              autoFocus={highlightedIndex === index}
            >
              <CountryAsyncCard
                country={country}
                onSelect={() => {}}
                isSelected={selectedCountries.includes(country)}
                isHighlighted={index === highlightedIndex}
              />
            </div>
          ))
        )}
      </List>
    </Paper>
  );
}

export default AsyncDropdown;
