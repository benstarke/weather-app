import React, { useState, useEffect, useRef } from 'react';
import { searchCity } from '../services/api';
import { City } from '../types/weather';

interface SearchBarProps {
  onCitySelect: (city: City) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const cities = await searchCity(query);
      setResults(cities);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching for cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="flex">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 w-full h-10"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ borderRadius: 0 }}
        />
        <button 
          className="bg-gray-200 px-4 h-10 border border-gray-300 border-l-0"
          onClick={handleSearch}
          style={{ borderRadius: 0 }}
        >
          Go
        </button>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white shadow-lg mt-1" style={{ borderRadius: 0 }}>
          {results.map((city, index) => (
            <div 
              key={`${city.name}-${city.lat}-${city.lon}`}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCitySelect(city)}
            >
              {city.name}, {city.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;