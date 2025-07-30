import React, { useEffect, useState } from 'react';
import { api } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

interface Neighborhood {
  _id: string;
  name: string;
  city: string;
  state: string;
  imageUrl?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const AdminPortal: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '', city: '', state: '',
    imageUrl: '',
    metrics: { safety: 5, affordability: 5, cleanliness: 5, walkability: 5, nightlife: 5, transport: 5 },
    amenities: { schools: 0, hospitals: 0, parks: 0, restaurants: 0, shoppingCenters: 0, gyms: 0 },
    demographics: { averageAge: 0, populationDensity: 0, averageIncome: 0 },
    housing: { averageRent1BHK: 0, averageRent2BHK: 0, averageRent3BHK: 0, averagePropertyPrice: 0 },
    coordinates: { latitude: 0, longitude: 0 }
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '', city: '', state: '',
    imageUrl: '',
    metrics: { safety: 5, affordability: 5, cleanliness: 5, walkability: 5, nightlife: 5, transport: 5 },
    amenities: { schools: 0, hospitals: 0, parks: 0, restaurants: 0, shoppingCenters: 0, gyms: 0 },
    demographics: { averageAge: 0, populationDensity: 0, averageIncome: 0 },
    housing: { averageRent1BHK: 0, averageRent2BHK: 0, averageRent3BHK: 0, averagePropertyPrice: 0 },
    coordinates: { latitude: 0, longitude: 0 }
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [userEditId, setUserEditId] = useState<string | null>(null);
  const [userEditForm, setUserEditForm] = useState<{ isAdmin: boolean }>({ isAdmin: false });
  const [userEditLoading, setUserEditLoading] = useState(false);
  const [userDeleteLoading, setUserDeleteLoading] = useState<string | null>(null);
  const [userActionMsg, setUserActionMsg] = useState('');

  useEffect(() => {
    fetchNeighborhoods();
    fetchUsers();
  }, []);

  const fetchNeighborhoods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/neighborhoods');
      setNeighborhoods(response.data.neighborhoods);
    } catch (err: any) {
      setError('Failed to load neighborhoods');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (err: any) {
      setUsersError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim() || !form.city.trim() || !form.state.trim()) {
      setError('All fields are required.');
      return;
    }
    setCreating(true);
    try {
      await api.post('/neighborhoods', form);
      setSuccess('Neighborhood created successfully!');
      setForm({
        name: '', city: '', state: '',
        imageUrl: '',
        metrics: { safety: 5, affordability: 5, cleanliness: 5, walkability: 5, nightlife: 5, transport: 5 },
        amenities: { schools: 0, hospitals: 0, parks: 0, restaurants: 0, shoppingCenters: 0, gyms: 0 },
        demographics: { averageAge: 0, populationDensity: 0, averageIncome: 0 },
        housing: { averageRent1BHK: 0, averageRent2BHK: 0, averageRent3BHK: 0, averagePropertyPrice: 0 },
        coordinates: { latitude: 0, longitude: 0 }
      });
      setShowCreate(false);
      fetchNeighborhoods();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create neighborhood');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (n: any) => {
    setEditId(n._id);
    setEditForm({
      name: n.name,
      city: n.city,
      state: n.state,
      imageUrl: n.imageUrl || '',
      metrics: { ...n.metrics },
      amenities: { ...n.amenities },
      demographics: { ...n.demographics },
      housing: { ...n.housing },
      coordinates: { ...n.coordinates }
    });
    setSuccess('');
    setError('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({
      name: '', city: '', state: '',
      imageUrl: '',
      metrics: { safety: 5, affordability: 5, cleanliness: 5, walkability: 5, nightlife: 5, transport: 5 },
      amenities: { schools: 0, hospitals: 0, parks: 0, restaurants: 0, shoppingCenters: 0, gyms: 0 },
      demographics: { averageAge: 0, populationDensity: 0, averageIncome: 0 },
      housing: { averageRent1BHK: 0, averageRent2BHK: 0, averageRent3BHK: 0, averagePropertyPrice: 0 },
      coordinates: { latitude: 0, longitude: 0 }
    });
  };

  const handleEditSave = async (id: string) => {
    setEditLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/neighborhoods/${id}`, editForm);
      setSuccess('Neighborhood updated successfully!');
      setEditId(null);
      fetchNeighborhoods();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update neighborhood');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this neighborhood?')) return;
    setDeleteLoading(id);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/neighborhoods/${id}`);
      setSuccess('Neighborhood deleted successfully!');
      fetchNeighborhoods();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete neighborhood');
    } finally {
      setDeleteLoading(null);
    }
  };

  const startUserEdit = (u: User) => {
    setUserEditId(u._id);
    setUserEditForm({ isAdmin: u.isAdmin });
    setUserActionMsg('');
  };
  const cancelUserEdit = () => {
    setUserEditId(null);
    setUserEditForm({ isAdmin: false });
  };
  const handleUserEditSave = async (id: string) => {
    setUserEditLoading(true);
    setUserActionMsg('');
    try {
      await api.put(`/auth/users/${id}/admin`, { isAdmin: userEditForm.isAdmin });
      setUserActionMsg('User admin status updated!');
      setUserEditId(null);
      fetchUsers();
    } catch (err: any) {
      setUserActionMsg(err.response?.data?.message || 'Failed to update user');
    } finally {
      setUserEditLoading(false);
    }
  };
  const handleUserDelete = async (id: string) => {
    if (id === currentUser?._id) {
      setUserActionMsg("You can't delete your own account.");
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUserDeleteLoading(id);
    setUserActionMsg('');
    try {
      await api.delete(`/auth/users/${id}`);
      setUserActionMsg('User deleted!');
      fetchUsers();
    } catch (err: any) {
      setUserActionMsg(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUserDeleteLoading(null);
    }
  };

  return (
    <div className="admin-portal-page" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>Admin Portal</h1>
      <p>Welcome, Admin! Here you can manage neighborhoods, users, and more.</p>

      {/* Neighborhood Management Section */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2>Neighborhood Management</h2>
        <div style={{ margin: '1.5rem 0' }}>
          <button
            onClick={() => setShowCreate((v) => !v)}
            style={{ padding: '0.5rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 }}
            disabled={creating}
          >
            {showCreate ? 'Cancel' : 'Create Neighborhood'}
          </button>
        </div>
        {showCreate && (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 500 }}>Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4, minWidth: 180 }} disabled={creating} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500 }}>City</label>
                <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4, minWidth: 140 }} disabled={creating} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500 }}>State</label>
                <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4, minWidth: 100 }} disabled={creating} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500 }}>Image URL</label>
                <input type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: 4, minWidth: 200 }} disabled={creating} />
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" style={{ marginTop: 4, width: 60, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                )}
              </div>
            </div>
            <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
              <legend style={{ fontWeight: 500 }}>Metrics</legend>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(form.metrics).map(([key, value]) => (
                  <div key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input type="number" min={1} max={10} value={value} onChange={e => setForm(f => ({ ...f, metrics: { ...f.metrics, [key]: Number(e.target.value) } }))} disabled={creating} style={{ width: 60 }} />
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
              <legend style={{ fontWeight: 500 }}>Amenities</legend>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(form.amenities).map(([key, value]) => (
                  <div key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input type="number" min={0} value={value} onChange={e => setForm(f => ({ ...f, amenities: { ...f.amenities, [key]: Number(e.target.value) } }))} disabled={creating} style={{ width: 60 }} />
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
              <legend style={{ fontWeight: 500 }}>Demographics</legend>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(form.demographics).map(([key, value]) => (
                  <div key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input type="number" min={0} value={value} onChange={e => setForm(f => ({ ...f, demographics: { ...f.demographics, [key]: Number(e.target.value) } }))} disabled={creating} style={{ width: 80 }} />
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
              <legend style={{ fontWeight: 500 }}>Housing</legend>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(form.housing).map(([key, value]) => (
                  <div key={key}>
                    <label>{key}</label>
                    <input type="number" min={0} value={value} onChange={e => setForm(f => ({ ...f, housing: { ...f.housing, [key]: Number(e.target.value) } }))} disabled={creating} style={{ width: 100 }} />
                  </div>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
              <legend style={{ fontWeight: 500 }}>Coordinates</legend>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <label>Latitude</label>
                  <input type="number" value={form.coordinates.latitude} onChange={e => setForm(f => ({ ...f, coordinates: { ...f.coordinates, latitude: Number(e.target.value) } }))} disabled={creating} style={{ width: 100 }} />
                </div>
                <div>
                  <label>Longitude</label>
                  <input type="number" value={form.coordinates.longitude} onChange={e => setForm(f => ({ ...f, coordinates: { ...f.coordinates, longitude: Number(e.target.value) } }))} disabled={creating} style={{ width: 100 }} />
                </div>
              </div>
            </fieldset>
            <button type="submit" style={{ padding: '0.5rem 1.5rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: creating ? 'not-allowed' : 'pointer', marginTop: '1rem' }} disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        )}
        {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {loading ? (
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>Loading neighborhoods...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f3f3f3' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>City</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>State</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {neighborhoods.map((n) => (
                <tr key={n._id}>
                  <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>
                    {n.imageUrl ? (
                      <img src={n.imageUrl} alt={n.name} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                    ) : (
                      <span style={{ color: '#bbb' }}>No image</span>
                    )}
                  </td>
                  {editId === n._id ? (
                    <>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }} colSpan={4}>
                        <form onSubmit={e => { e.preventDefault(); handleEditSave(n._id); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div>
                              <label>Name</label>
                              <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} disabled={editLoading} style={{ width: 120 }} />
                            </div>
                            <div>
                              <label>City</label>
                              <input type="text" value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} disabled={editLoading} style={{ width: 100 }} />
                            </div>
                            <div>
                              <label>State</label>
                              <input type="text" value={editForm.state} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))} disabled={editLoading} style={{ width: 80 }} />
                            </div>
                            <div>
                              <label>Image URL</label>
                              <input type="text" value={editForm.imageUrl} onChange={e => setEditForm(f => ({ ...f, imageUrl: e.target.value }))} disabled={editLoading} style={{ width: 200 }} />
                              {editForm.imageUrl && (
                                <img src={editForm.imageUrl} alt="Preview" style={{ marginTop: 4, width: 60, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
                              )}
                            </div>
                          </div>
                          <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
                            <legend style={{ fontWeight: 500 }}>Metrics</legend>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {Object.entries(editForm.metrics).map(([key, value]) => (
                                <div key={key}>
                                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                  <input type="number" min={1} max={10} value={value} onChange={e => setEditForm(f => ({ ...f, metrics: { ...f.metrics, [key]: Number(e.target.value) } }))} disabled={editLoading} style={{ width: 60 }} />
                                </div>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
                            <legend style={{ fontWeight: 500 }}>Amenities</legend>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {Object.entries(editForm.amenities).map(([key, value]) => (
                                <div key={key}>
                                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                  <input type="number" min={0} value={value} onChange={e => setEditForm(f => ({ ...f, amenities: { ...f.amenities, [key]: Number(e.target.value) } }))} disabled={editLoading} style={{ width: 60 }} />
                                </div>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
                            <legend style={{ fontWeight: 500 }}>Demographics</legend>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {Object.entries(editForm.demographics).map(([key, value]) => (
                                <div key={key}>
                                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                  <input type="number" min={0} value={value} onChange={e => setEditForm(f => ({ ...f, demographics: { ...f.demographics, [key]: Number(e.target.value) } }))} disabled={editLoading} style={{ width: 80 }} />
                                </div>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
                            <legend style={{ fontWeight: 500 }}>Housing</legend>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {Object.entries(editForm.housing).map(([key, value]) => (
                                <div key={key}>
                                  <label>{key}</label>
                                  <input type="number" min={0} value={value} onChange={e => setEditForm(f => ({ ...f, housing: { ...f.housing, [key]: Number(e.target.value) } }))} disabled={editLoading} style={{ width: 100 }} />
                                </div>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset style={{ border: '1px solid #eee', borderRadius: 4, padding: '0.5rem 1rem' }}>
                            <legend style={{ fontWeight: 500 }}>Coordinates</legend>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <div>
                                <label>Latitude</label>
                                <input type="number" value={editForm.coordinates.latitude} onChange={e => setEditForm(f => ({ ...f, coordinates: { ...f.coordinates, latitude: Number(e.target.value) } }))} disabled={editLoading} style={{ width: 100 }} />
                              </div>
                              <div>
                                <label>Longitude</label>
                                <input type="number" value={editForm.coordinates.longitude} onChange={e => setEditForm(f => ({ ...f, coordinates: { ...f.coordinates, longitude: Number(e.target.value) } }))} disabled={editLoading} style={{ width: 100 }} />
                              </div>
                            </div>
                          </fieldset>
                          <div style={{ marginTop: '1rem' }}>
                            <button type="submit" style={{ marginRight: 8, padding: '0.3rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: editLoading ? 'not-allowed' : 'pointer' }} disabled={editLoading}>
                              {editLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={cancelEdit} style={{ padding: '0.3rem 1rem', background: '#eee', color: '#333', border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }} disabled={editLoading}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{n.name}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{n.city}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{n.state}</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>
                        <button
                          onClick={() => startEdit(n)}
                          style={{ marginRight: 8, padding: '0.3rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}
                          disabled={editId !== null}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(n._id)}
                          style={{ padding: '0.3rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: deleteLoading === n._id ? 'not-allowed' : 'pointer' }}
                          disabled={deleteLoading === n._id || editId !== null}
                        >
                          {deleteLoading === n._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* User Management Section */}
      <section style={{ marginTop: '3rem' }}>
        <h2>User Management</h2>
        {userActionMsg && <div style={{ color: userActionMsg.includes('fail') ? 'red' : 'green', marginBottom: '1rem' }}>{userActionMsg}</div>}
        {usersLoading ? (
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>Loading users...</div>
        ) : usersError ? (
          <div style={{ color: 'red', margin: '2rem 0' }}>{usersError}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f3f3f3' }}>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>Admin</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'left' }}>Created</th>
                <th style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>
                    {userEditId === u._id ? (
                      <input
                        type="checkbox"
                        checked={userEditForm.isAdmin}
                        onChange={e => setUserEditForm(f => ({ ...f, isAdmin: e.target.checked }))}
                        disabled={userEditLoading || u._id === currentUser?._id}
                      />
                    ) : (
                      u.isAdmin ? 'Yes' : 'No'
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #eee' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #eee', textAlign: 'center' }}>
                    {userEditId === u._id ? (
                      <>
                        <button
                          onClick={() => handleUserEditSave(u._id)}
                          style={{ marginRight: 8, padding: '0.3rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: userEditLoading ? 'not-allowed' : 'pointer' }}
                          disabled={userEditLoading || u._id === currentUser?._id}
                        >
                          {userEditLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelUserEdit}
                          style={{ padding: '0.3rem 1rem', background: '#eee', color: '#333', border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}
                          disabled={userEditLoading}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startUserEdit(u)}
                          style={{ marginRight: 8, padding: '0.3rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: u._id === currentUser?._id ? 'not-allowed' : 'pointer' }}
                          disabled={u._id === currentUser?._id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUserDelete(u._id)}
                          style={{ padding: '0.3rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: userDeleteLoading === u._id ? 'not-allowed' : 'pointer' }}
                          disabled={userDeleteLoading === u._id || u._id === currentUser?._id}
                        >
                          {userDeleteLoading === u._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPortal; 