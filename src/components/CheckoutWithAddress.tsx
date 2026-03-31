import { useState } from 'react';
import { AddressAutocomplete, AddressData } from './AddressAutocomplete';
import { paymentApi } from '../services/api';

export const CheckoutWithAddress = () => {
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [address, setAddress] = useState<AddressData | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleAddressSelect = (addr: AddressData) => {
    if (addr.lat === 0 && addr.lng === 0) {
      alert('Please select a valid address');
      return;
    }
    setAddress(addr);
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!address) return;
    setProcessing(true);
    
    try {
      const response = await paymentApi.createIntent(299.99, address);
      if (response.data.clientSecret || response.data.success) {
        setStep('confirmation');
      }
    } catch (error) {
      alert('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Progress */}
      <div className="flex items-center mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step !== 'address' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
          {step !== 'address' ? '✓' : '1'}
        </div>
        <div className={`flex-1 h-1 mx-2 ${step !== 'address' ? 'bg-green-600' : 'bg-gray-300'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirmation' ? 'bg-green-600 text-white' : step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
          {step === 'confirmation' ? '✓' : '2'}
        </div>
      </div>

      {step === 'address' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Where should we deliver?</h2>
          <AddressAutocomplete 
            onAddressSelect={handleAddressSelect}
            placeholder="Start typing your address..."
          />
        </div>
      )}

      {step === 'payment' && address && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Deliver to:</h3>
                <p className="text-sm text-gray-600">{address.formatted_address}</p>
              </div>
              <button 
                onClick={() => setStep('address')}
                className="text-blue-600 text-sm hover:underline"
              >
                Change
              </button>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Pay R299.99'}
          </button>
        </div>
      )}

      {step === 'confirmation' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Delivering to: {address?.formatted_address}</p>
        </div>
      )}
    </div>
  );
};