import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { addressApi } from '../services/api';

export interface AddressData {
  formatted_address: string;
  lat: number;
  lng: number;
  components: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressData) => void;
  placeholder?: string;
}

export const AddressAutocomplete = ({ 
  onAddressSelect, 
  placeholder = "Type your address..."
}: AddressAutocompleteProps) => {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (input.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(input);
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  const searchAddresses = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await addressApi.search(searchText);
      setPredictions(response.data.predictions || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (prediction: any) => {
    setInput(prediction.description);
    setShowDropdown(false);
    
    const lat = parseFloat(prediction.lat) || 0;
    const lng = parseFloat(prediction.lon) || 0;
    const parts = prediction.description.split(',').map((p: string) => p.trim());
    const addr = prediction.address || {};
    
    const addressData: AddressData = {
      formatted_address: prediction.description,
      lat,
      lng,
      components: {
        street: addr.road || parts[0],
        city: addr.city || addr.town || parts[1],
        state: addr.state || parts[2],
        zip: addr.postcode,
        country: addr.country || parts[parts.length - 1]
      }
    };

    onAddressSelect(addressData);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
        )}
      </div>

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction, index) => (
            <button
              key={index}
              onClick={() => handleSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-0 flex items-start gap-3"
            >
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && !loading && input.length >= 3 && predictions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No addresses found
        </div>
      )}
    </div>
  );
};