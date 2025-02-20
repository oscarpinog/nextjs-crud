'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Función para obtener usuarios (GET)
async function fetchUsers() {
  const res = await fetch('https://reqres.in/api/users');
  if (!res.ok) {
    throw new Error('Error fetching users');
  }
  const data = await res.json();
  return data.data; // Devuelve solo la lista de usuarios
}

// Función para crear un usuario (POST)
async function createUser(userData) {
  const res = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error('Error creating user');
  }
  return res.json();
}

function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', job: '' });
  const [createResult, setCreateResult] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const initialUsers = await fetchUsers();
        setUsers(initialUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
  }, []);

  // Función para recargar los usuarios después de crear uno nuevo
  const refreshUsers = async () => {
    try {
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Manejar envío del formulario para crear un usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createUser(newUser);
      setCreateResult(result);
      setNewUser({ name: '', job: '' }); // Limpiar formulario
      await refreshUsers(); // Recargar usuarios
    } catch (error) {
      console.error('Error creating user:', error);
      setCreateResult({ error: 'Error al crear el usuario' });
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Lista de Usuarios</h1>
          {/* Botón que alterna la visibilidad del formulario */}
          <button
            type="button"
            className={showForm ? "btn btn-danger" : "btn btn-primary"}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Hide Create New User' : 'Create New User'}
          </button>
        </div>

        {/* Formulario para crear un nuevo usuario (visible según showForm) */}
        {showForm && (
          <div className="container py-5">
            <h2>Create New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
                  placeholder="Escriba un nombre"
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Job</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.job}
                  placeholder="Escriba un trabajo"
                  onChange={(e) =>
                    setNewUser({ ...newUser, job: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create User
              </button>
            </form>
          </div>
        )}
        <hr />
        <ul>
          {users.map((user) => (
            <li
              className="rounded list-group-item-primary d-flex justify-content-between align-items-center
              list-group-item-action"
              key={user.id}
              onClick={() => router.push(`/users/${user.id}`)}
              style={{ cursor: 'pointer', marginBottom: '1rem' }}
            >
              <div>
                <h5>
                  {user.id} - {user.first_name} {user.last_name}
                </h5>
                <p>{user.email}</p>
              </div>
              <img
                className="rounded-circle"
                src={user.avatar}
                alt={user.email}
                style={{ maxWidth: '100px' }}
              />
            </li>
          ))}
        </ul>
        <hr />
        {createResult && (
          <div className="alert alert-success mt-3" role="alert">
            <h4 className="alert-heading">User Created Successfully!</h4>
            <pre>{JSON.stringify(createResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;
