'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Head from 'next/head';

// Función para obtener un usuario (GET)
async function getUser(id) {
  const res = await fetch(`https://reqres.in/api/users/${id}`);
  if (!res.ok) {
    throw new Error('Error fetching user');
  }
  const data = await res.json();
  return data.data;
}

// Función para actualizar un usuario (PUT)
async function updateUser(userData) {
  const res = await fetch(`https://reqres.in/api/users/${userData.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error('Error updating user');
  }
  const data = await res.json();
  return data;
}

export default function UsersPage() {
  const { id } = useParams(); // Obtenemos el id desde la URL
  const router = useRouter();
  const [user, setUser] = useState(null);
  // Estado para editar el usuario. Se inicializa vacío y se actualizará con los datos del usuario una vez que se carguen.
  const [newUser, setNewUser] = useState({ id: '', name: '', job: '' });
  const [createResult, setCreateResult] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (id) {
      getUser(id)
        .then((data) => {
          setUser(data);
          setLoadingUser(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setErrorMsg('Error al obtener el usuario');
          setLoadingUser(false);
        });
    }
  }, [id]);

  // Una vez cargado el usuario, inicializamos el estado de edición (newUser)
  useEffect(() => {
    if (user && !newUser.name) {
      setNewUser({ id: user.id, name: user.first_name, job: '' });
    }
  }, [user]);

  // Manejar envío del formulario para actualizar el usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUser(newUser);
      console.log("newUser",newUser);
      setCreateResult(result);
    } catch (error) {
      console.error('Error updating user:', error);
      setCreateResult({ error: 'Error al actualizar el usuario' });
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/5/slate/bootstrap.min.css"
        />
      </Head>
      <div className="container py-5">
        <h1 className="mb-4">User Details</h1>

        {loadingUser ? (
          <p>Loading user...</p>
        ) : errorMsg ? (
          <p className="text-danger">{errorMsg}</p>
        ) : user ? (
          <div className="card mb-4" style={{ maxWidth: '540px' }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="img-fluid rounded-start"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h3 className="card-title">
                    {user.id} - {user.first_name} {user.last_name}
                  </h3>
                  <p className="card-text">{user.email}</p>
                  <button
                    type="button"
                    className={showForm ? "btn btn-danger" : "btn btn-primary"}
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? 'Hide Update Form' : 'Update User Form'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>No user found.</p>
        )}

        <hr />

        {showForm && (<div>
          <h2>Edit User</h2>
          {loadingUser ? (
            <p>Loading user...</p>
          ) : errorMsg ? (
            <p className="text-danger">{errorMsg}</p>
          ) : user ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                {/* Se usa newUser.name para que el campo esté pre-poblado y sea editable */}
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
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
                  placeholder='Escriba un trabajo'
                  onChange={(e) =>
                    setNewUser({ ...newUser, job: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-secondary">
                Update User
              </button>
            </form>
          ) : (
            <p>No user found.</p>
          )}
        </div>
        )}

        {createResult && (
          <div className="alert alert-success mt-3" role="alert">
            <h4 className="alert-heading">User Updated Successfully!</h4>
            <pre>{JSON.stringify(createResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
}
