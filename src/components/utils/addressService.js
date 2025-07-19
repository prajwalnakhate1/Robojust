import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  isValidAddressData,
} from '../../services/addressService'; // Import service functions

// Constants
const INITIAL_FORM_STATE = {
  name: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  isDefault: false,
};

// Address Card Component
const AddressCard = ({ address, onSelect, onEdit, onDelete }) => (
  <div className="address-card">
    <div
      onClick={() => onSelect?.(address)}
      className="address-card-content cursor-pointer"
    >
      <p className="text-base font-medium text-gray-800">
        {address.name} {address.isDefault && <span className="text-green-600 text-sm">(Default)</span>}
      </p>
      <p className="text-sm text-gray-700">
        {address.street}, {address.city}, {address.state} - {address.zip}
      </p>
      <p className="text-sm text-gray-600">📞 {address.phone}</p>
    </div>
    <div className="flex justify-end gap-2 mt-4">
      <button
        className="btn btn-primary px-3 py-1 text-sm"
        onClick={() => onEdit(address)}
      >
        Edit
      </button>
      <button
        className="btn btn-text px-3 py-1 text-sm text-red-600 hover:text-red-700"
        onClick={() => onDelete(address.id)}
      >
        Delete
      </button>
    </div>
  </div>
);

// Address Form Component
const AddressForm = ({ form, onChange, onSubmit, onCancel, editingId, loading }) => (
  <form onSubmit={onSubmit} className="address-form">
    <h3 className="text-lg font-semibold mt-8 mb-2">
      {editingId ? 'Edit Address' : 'Add New Address'}
    </h3>
    <div className="form-grid">
      {['name', 'street', 'city', 'state', 'zip', 'phone'].map((field) => (
        <div key={field} className="form-group">
          <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type="text"
            name={field}
            value={form[field]}
            onChange={onChange}
            className="form-input"
            pattern={field === 'zip' ? '\\d{6}' : field === 'phone' ? '\\d{10}' : undefined}
            required
          />
        </div>
      ))}
      <div className="form-group">
        <label className="form-label flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={(e) => onChange({ target: { name: 'isDefault', value: e.target.checked } })}
            className="mr-2"
          />
          Set as Default
        </label>
      </div>
    </div>
    <div className="form-actions">
      {editingId && (
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-text"
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        className="btn btn-success"
        disabled={loading}
      >
        {loading ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
      </button>
    </div>
  </form>
);

// Main Component
const AddressStep = ({ onSelectAddress }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchAddresses(user.uid);
      setAddresses(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidAddressData(form)) {
      toast.error('Please fill all fields correctly.');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editingId) {
        result = await updateAddress(user.uid, editingId, form);
        if (result.success) {
          toast.success('✅ Address updated!');
          setEditingId(null);
        }
      } else {
        result = await addAddress(user.uid, form);
        if (result.success) {
          toast.success('✅ Address added!');
        }
      }

      if (!result.success) {
        toast.error(result.error || '❌ Failed to save address');
        setLoading(false);
        return;
      }

      setForm(INITIAL_FORM_STATE);
      fetchUserAddresses();
    } catch {
      toast.error('❌ Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setForm(address);
    setEditingId(address.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setLoading(true);
    try {
      const result = await deleteAddress(user.uid, id);
      if (result.success) {
        toast.success('🗑️ Address deleted');
        fetchUserAddresses();
      } else {
        toast.error(result.error || '❌ Failed to delete address');
      }
    } catch {
      toast.error('❌ Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(INITIAL_FORM_STATE);
  };

  return (
    <div className="address-step-container">
      <h2 className="step-title">Saved Addresses</h2>
      <div className="address-list">
        {loading && !addresses.length ? (
          <p className="text-gray-600">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-600">No saved addresses yet.</p>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onSelect={onSelectAddress}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      <AddressForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        editingId={editingId}
        loading={loading}
      />
    </div>
  );
};

export default AddressStep;