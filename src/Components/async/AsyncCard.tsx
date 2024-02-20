import React, { useState, useEffect, useRef, useCallback } from "react";
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import callApi from "../../API";
import AsyncDropDown from "./AsyncDropDown";
import { CountryData } from '../../CountryData';

const AsyncCard: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [originalList, setOriginalList] = useState<CountryData[]>([]);
  const [filteredResults, setFilteredResults] = useState<CountryData[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<CountryData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jsonData = await callApi();
        const countryDataList: CountryData[] = jsonData.map((item: any) => ({
          name: item.name.common,
          currency: Object.keys(item.currencies)[0],
          currency_name: item.currencies[Object.keys(item.currencies)[0]].name,
          emoji: item.flag,
          active: false,
        }));
        countryDataList.sort((a, b) => a.name.localeCompare(b.name));
        setOriginalList(countryDataList);
        setFilteredResults(countryDataList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const debouncedHandleInputChange = useCallback(
    debounce(async (value: string) => {
      setLoading(true);

      const filteredCountryData = originalList.filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredResults(filteredCountryData);
      setDropdownVisible(true);
      setLoading(false);

      // Reset the highlighted index when the search results change
      setHighlightedIndex(0);
    }, 500),
    [originalList]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    setDropdownVisible(false);
    setLoading(true);

    // Clear the results and cancel the ongoing request if input is empty
    if (inputValue.trim() === "") {
      setFilteredResults([]);
      setLoading(false);
      return;
    }

    debouncedHandleInputChange(inputValue);

    // Set the highlighted index to 0 when the dropdown is not visible
    if (!isDropdownVisible) {
      setHighlightedIndex(0);
    }
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
    setDropdownVisible(false);
  });

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setDropdownVisible(false);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyPress);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, []);

  return (
    <div className="flex flex-col pb-5" style={{ position: "relative" }}>
      <label className="mb-2 text-gray-600">Async Search</label>
      <div ref={ref}>
        <TextField
          id="asyncTextField"
          className="w-full"
          ref={ref}
          onKeyDown={handleKeywordKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-500" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading && !isDropdownVisible && (
                  <CircularProgress size={20} />
                )}
              </InputAdornment>
            ),
          }}
          placeholder="Type to begin searching"
          value={inputValue}
          onChange={handleInputChange}
        />
        {isDropdownVisible && (
          <AsyncDropDown
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
      With description and custom results display
      </div>
    </div>
  );
};

export default AsyncCard;

// Debounce function
function debounce(func: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function debounced(...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
