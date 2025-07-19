import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Import icons if using an icon library
import { FiEdit2, FiTrash2, FiCheck, FiMapPin, FiLoader } from 'react-icons/fi';
import './AddressStep.css'; // or whatever your CSS file is named

const addressSchema = z.object({
  name: z.string().min(1, 'Full Name is required').regex(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces'),
  address: z.string().min(1, 'Street Address is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  landmark: z.string().optional(),
  area: z.string().optional(),
  tehsil: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  isDefault: z.boolean().optional(),
});

const FIELD_LABELS = {
  name: 'Full Name',
  address: 'Street Address',
  landmark: 'Nearby Landmark',
  area: 'Area/Locality',
  tehsil: 'Tehsil/Taluka',
  district: 'District',
  state: 'State',
  city: 'City',
  pincode: 'Pincode',
  phone: 'Phone Number',
  isDefault: 'Set as Default Address',
};

const REQUIRED_FIELDS = ['name', 'address', 'city', 'pincode', 'phone'];

const AddressStep = ({ onSelectAddress, onNext }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [saveAsNew, setSaveAsNew] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: '',
      address: '',
      landmark: '',
      area: '',
      tehsil: '',
      district: '',
      state: '',
      city: '',
      pincode: '',
      phone: '',
      isDefault: false,
    },
  });

  const formValues = watch();

  const addressesRef = useMemo(() => {
    if (!user) return null;
    return collection(db, 'users', user.uid, 'addresses');
  }, [user]);

  const fetchAddresses = useCallback(async () => {
    if (!addressesRef) return;
    setIsFetching(true);
    try {
      const snapshot = await getDocs(addressesRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsFetching(false);
    }
  }, [addressesRef]);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [fetchAddresses, user]);

  const onSubmit = async (data) => {
    if (!user || !addressesRef) {
      toast.error('You must be logged in to save an address.');
      return;
    }

    setIsLoading(true);
    try {
      const addressData = { ...data, userId: user.uid };
      
      if (data.isDefault) {
        const batch = writeBatch(db);
        addresses.forEach((addr) => {
          if (addr.id !== editingId && addr.isDefault) {
            batch.update(doc(addressesRef, addr.id), { isDefault: false });
          }
        });
        await batch.commit();
      }

      if (editingId && !saveAsNew) {
        await updateDoc(doc(addressesRef, editingId), addressData);
        toast.success('Address updated successfully');
      } else {
        await addDoc(addressesRef, addressData);
        toast.success(editingId ? 'Address saved as new' : 'Address added successfully');
      }

      reset();
      setEditingId(null);
      setSaveAsNew(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.code === 'permission-denied' ? 'Permission denied. Please check your account.' : 'Error saving address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address) => {
    Object.entries(address).forEach(([key, value]) => {
      setValue(key, value);
    });
    setEditingId(address.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!user || !addressesRef) return;
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteDoc(doc(addressesRef, id));
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success('Address deleted successfully');
      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error(error.code === 'permission-denied' ? 'Permission denied. Please check your account.' : 'Error deleting address');
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
    setSaveAsNew(false);
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.warning('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      const address = data.address || {};

      const newAddress = {
        address: [address.road, address.house_number].filter(Boolean).join(' ') || '',
        landmark: address.neighbourhood || '',
        area: address.suburb || '',
        tehsil: address.county || '',
        district: address.state_district || address.district || '',
        state: address.state || '',
        city: address.city || address.town || address.village || '',
        pincode: address.postcode || '',
        phone: '',
      };

      Object.entries(newAddress).forEach(([key, value]) => {
        setValue(key, value);
      });

      toast.success('Location autofilled successfully');
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error('Failed to fetch location. Please try again.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onSelectAddress(address);
    onNext();
  };

  const isFormDirty = Object.values(formValues).some(
    (value, index) => value !== addressSchema.shape[Object.keys(formValues)[index]].optional().parse(undefined)
  );

  return (
    <div className="address-step-container">
      <h2 className="step-title">Manage Addresses</h2>

      <button
        onClick={getCurrentLocation}
        className="btn btn-location mb-6"
        disabled={isLocating}
        aria-label="Use current location"
      >
        {isLocating ? (
          <>
            <FiLoader className="animate-spin" />
            <span>Fetching Location...</span>
          </>
        ) : (
          <>
            <FiMapPin />
            <span>Use My Current Location</span>
          </>
        )}
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="address-form">
        <h3>{editingId ? (saveAsNew ? 'Save as New Address' : 'Edit Address') : 'Add New Address'}</h3>
        
        {editingId && !saveAsNew && (
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="saveAsNew"
              checked={saveAsNew}
              onChange={(e) => setSaveAsNew(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="saveAsNew" className="ml-2 text-sm text-gray-700">
              Save as new address instead of updating
            </label>
          </div>
        )}

        <div className="form-grid">
          {Object.entries(FIELD_LABELS).map(([key, label]) => (
            <div key={key} className={`form-group ${key === 'isDefault' ? 'col-span-full' : ''}`}>
              <label htmlFor={key} className={`form-label ${REQUIRED_FIELDS.includes(key) ? 'required' : ''}`}>
                {label}
              </label>
              {key === 'isDefault' ? (
                <div className="flex items-center h-12">
                  <input
                    type="checkbox"
                    id={key}
                    {...register('isDefault')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              ) : (
                <input
                  type={key === 'phone' || key === 'pincode' ? 'tel' : 'text'}
                  id={key}
                  {...register(key)}
                  className={`form-input ${errors[key] ? '!border-red-500' : ''}`}
                  aria-invalid={errors[key] ? 'true' : 'false'}
                  aria-describedby={errors[key] ? `${key}-error` : undefined}
                />
              )}
              {errors[key] && (
                <p id={`${key}-error`} className="mt-1 text-sm text-red-600">
                  {errors[key].message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          {(editingId || isFormDirty) && (
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            aria-label={editingId ? (saveAsNew ? 'Save as new address' : 'Update address') : 'Add address'}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : editingId ? (
              saveAsNew ? (
                'Save as New'
              ) : (
                <>
                  <FiEdit2 />
                  <span>Update Address</span>
                </>
              )
            ) : (
              'Add Address'
            )}
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h4 className="text-base font-semibold mb-4">Saved Addresses</h4>
        {isFetching ? (
          <div className="flex justify-center py-8">
            <FiLoader className="animate-spin text-2xl text-gray-500" />
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-muted italic text-center py-8">No saved addresses yet</p>
        ) : (
          <div className="address-list">
            {addresses.map((addr, index) => (
              <div 
                key={addr.id} 
                className={`address-card ${selectedAddress?.id === addr.id ? '!border-blue-500 !bg-blue-50' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="address-card-content" onClick={() => setSelectedAddress(addr)}>
                  <p className="text-base">{addr.name}</p>
                  <p className="text-sm">
                    {addr.address}, {addr.area}, {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-sm text-muted mt-2">
                    State: {addr.state}, District: {addr.district}, Tehsil: {addr.tehsil}
                  </p>
                  <p className="text-sm text-muted">Landmark: {addr.landmark || 'N/A'}</p>
                  <p className="text-sm text-muted">📞 {addr.phone}</p>
                  {addr.isDefault && (
                    <div className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      <FiCheck className="mr-1" />
                      Default Address
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-3 flex-wrap">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="btn btn-outline !py-1 !px-3 !text-sm"
                    aria-label={`Edit address for ${addr.name}`}
                  >
                    <FiEdit2 className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="btn btn-danger !py-1 !px-3 !text-sm"
                    aria-label={`Delete address for ${addr.name}`}
                  >
                    <FiTrash2 className="mr-1" />
                    Delete
                  </button>
                  <button
                    onClick={() => handleSelectAddress(addr)}
                    className="btn btn-success !py-1 !px-3 !text-sm ml-auto"
                    aria-label={`Use address for ${addr.name}`}
                  >
                    Use this Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAddress && (
        <div className="mt-8 text-center">
          <button
            onClick={() => handleSelectAddress(selectedAddress)}
            className="btn btn-primary !px-8 !py-3 !text-base"
            disabled={isLoading}
            aria-label="Continue to payment step"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressStep;