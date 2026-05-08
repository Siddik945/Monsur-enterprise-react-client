import { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
};

type UserForm = {
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
};

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<UserForm>({
    email: '',
    password: '',
    role: 'USER',
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/admin', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) window.location.href = '/';

      const data = await response.json();
      //   console.log(data);
      setUsers(data.data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = editId ? `http://localhost:3000/admin/${editId}` : 'http://localhost:3000/admin';
      const method = editId ? 'PUT' : 'POST';
      const token = localStorage.getItem('access_token');

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) window.location.href = '/';

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      setMessage(editId ? 'User updated successfully.' : 'User created successfully.');
      setFormData({ email: '', password: '', role: 'USER' });
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete user');

      setMessage('User deleted successfully.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ email: '', password: '', role: 'USER' });
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        {editId ? 'Update User' : 'Create User'}
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 max-w-2xl space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {!editId && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Saving...' : editId ? 'Update User' : 'Create User'}
          </button>

          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg bg-slate-500 px-6 py-3 font-semibold text-white hover:bg-slate-600"
            >
              Cancel
            </button>
          )}
        </div>

        {message && <p className="text-sm font-medium text-slate-700">{message}</p>}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="flex gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    disabled={user.role === 'ADMIN'} // Prevent deleting admins
                    className={`rounded px-3 py-1 text-xs font-semibold text-white ${
                      user.role === 'ADMIN'
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
