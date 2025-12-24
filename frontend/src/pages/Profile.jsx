import { useEffect, useState } from 'react';
import { addAddress, fetchProfile, saveProfile } from '../api/users.js';
import { useAuth } from '../hooks/useAuth.jsx';

const emptyProfile = {
  fullName: '',
  phone: ''
};

const emptyAddress = {
  label: '',
  street: '',
  city: '',
  state: '',
  postalCode: ''
};

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchProfile(user.id)
      .then((data) => {
        setProfile({ fullName: data.fullName || '', phone: data.phone || '' });
        setAddresses(data.addresses || []);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      setSavingProfile(true);
      setMessage('');
      await saveProfile(user.id, profile);
      setMessage('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    try {
      setSavingAddress(true);
      setMessage('');
      const updated = await addAddress(user.id, addressForm);
      setAddresses(updated.addresses || []);
      setAddressForm(emptyAddress);
      setMessage('Address added');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return (
      <section className="container" style={{ paddingTop: '3rem' }}>
        <p>Loading profile…</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ paddingTop: '3rem', display: 'grid', gap: '1.5rem' }}>
      <h2 style={{ marginBottom: 0 }}>Profile</h2>
      {message && <p style={{ color: '#16a34a' }}>{message}</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      <form className="card" onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Basic Information</h3>
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" value={profile.fullName} onChange={handleProfileChange} />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} />
        </div>
        <button type="submit" disabled={savingProfile}>
          {savingProfile ? 'Saving…' : 'Save Profile'}
        </button>
      </form>

      <form className="card" onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>Add Address</h3>
        <div className="input-group">
          <label htmlFor="label">Label</label>
          <input id="label" name="label" value={addressForm.label} onChange={handleAddressChange} placeholder="Home, Office" />
        </div>
        <div className="input-group">
          <label htmlFor="street">Street</label>
          <input id="street" name="street" value={addressForm.street} onChange={handleAddressChange} />
        </div>
        <div className="input-group">
          <label htmlFor="city">City</label>
          <input id="city" name="city" value={addressForm.city} onChange={handleAddressChange} />
        </div>
        <div className="input-group">
          <label htmlFor="state">State</label>
          <input id="state" name="state" value={addressForm.state} onChange={handleAddressChange} />
        </div>
        <div className="input-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input id="postalCode" name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} />
        </div>
        <button type="submit" disabled={savingAddress}>
          {savingAddress ? 'Adding…' : 'Add Address'}
        </button>
      </form>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <h3 style={{ margin: 0 }}>Saved Addresses</h3>
        {addresses.length === 0 && <p>No addresses yet.</p>}
        {addresses.map((address, index) => (
          <div key={`${address.label}-${index}`} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.8rem' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{address.label}</p>
            <p style={{ margin: '0.2rem 0', color: '#4b5563' }}>
              {address.street}, {address.city}, {address.state} {address.postalCode}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Profile;
