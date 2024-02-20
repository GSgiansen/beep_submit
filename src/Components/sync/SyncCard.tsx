import React, { useState, useEffect, useRef } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import callApi from "../../API";
import SyncDropDown from "./SyncDropDown";
import { CountryData } from '../../CountryData';
import { get } from "http";


const SyncCard: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [originalList, setOriginalList] = useState<CountryData[]>([]);
  const [filteredResults, setFilteredResults] = useState<CountryData[]>([]);
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [selectedCountries, setSelectedCountries] = useState<CountryData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await callApi();
        const countryDataList: CountryData[] = jsonData.map((item: any) => ({
          name: item.name.common,
          currency: Object.keys(item.currencies)[0],
          currency_name: item.currencies[Object.keys(item.currencies)[0]].name,
          active: false,
        }));
        countryDataList.sort((a, b) => a.name.localeCompare(b.name));
        setOriginalList(countryDataList);
        setFilteredResults(countryDataList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    const filteredCountryData = originalList.filter((country) =>
      country.name.toLowerCase().includes(inputValue.toLowerCase()) || country.currency.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredResults(filteredCountryData);
  };

  const handleClick = () => {
    setShowComponent(true);
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          (prevIndex + 1) % filteredResults.length
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          (prevIndex - 1 + filteredResults.length) % filteredResults.length
        );
        break;
      default:
        break;
    }
  };
  const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [callback]);

    return ref;
  };

  const ref = useOutsideClick(() => {
    setShowComponent(false);
  });

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setShowComponent(false);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyPress);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, []); // Empty dependency array ensures it runs once during component mount

  return (
    <div className="flex flex-col pb-5" style={{ position: "relative" }}>
      <label className="mb-2 text-gray-600">Sync Search</label>
      <div ref={ref}>
        <TextField
          id="syncTextField"
          className="w-full"
          onClick={handleClick}
          ref={ref}
          onKeyDown={handleKeywordKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-500" />
              </InputAdornment>
            ),
          }}
          placeholder="Type to begin searching"
          value={inputValue}
          onChange={handleInputChange}
        />
        {showComponent && (
          <SyncDropDown
            options={filteredResults}
            selectedCountries={selectedCountries}
            onCountrySelect={(updatedSelection) =>
              setSelectedCountries(updatedSelection)
            }
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
          />
        )}
      </div>
      <div>
      With default display and search on focus
      </div>
    </div>
  );
};

export default SyncCard;
