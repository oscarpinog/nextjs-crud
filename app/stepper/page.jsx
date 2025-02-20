'use client';

import { useState } from 'react';
import Head from 'next/head';

const initialFormData = {
  name: '',
  data: {
    year: '',
    price: '',
    'CPU model': '',
    'Hard disk size': ''
  }
};

export default function ProductStepper() {
  // Paso actual (1, 2 o 3)
  const [step, setStep] = useState(1);
  // Estado para almacenar los datos del producto (creado desde cero)
  const [formData, setFormData] = useState(initialFormData);
  const [postResult, setPostResult] = useState(null);
  const [error, setError] = useState('');

  // Funciones para navegar entre pasos
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el campo pertenece al objeto principal (id o name)
    if (name === 'name') {
      setFormData({ ...formData, [name]: value });
    } else {
      // El campo pertenece a formData.data
      setFormData({ ...formData, data: { ...formData.data, [name]: value } });
    }
  };

  // Función para hacer POST con el objeto completo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.restful-api.dev/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        throw new Error('Error al crear el producto');
      }
      const result = await res.json();
      setPostResult(result);
      setStep(1);//reiniciamos el step
      setFormData(initialFormData);//reiniciamos los valores
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        {/* Incluimos Bootstrap desde Bootswatch */}
        <link rel="stylesheet" href="https://bootswatch.com/5/slate/bootstrap.min.css" />
      </Head>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Stepper: Crear Producto</h1>
        
        {/* Barra de progreso horizontal */}
        <div className="mb-4">
          <div className="progress" style={{ height: '30px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(step / 3) * 100}%` }}
              aria-valuenow={step}
              aria-valuemin="0"
              aria-valuemax="3"
            >
              Paso {step} de 3
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Paso 1: ID y Name */}
          {step === 1 && (
            <div className="card mb-4">
              <div className="card-header">
                <h2>Paso 1: Datos Básicos</h2>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!formData.name}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Objeto data */}
          {step === 2 && (
            <div className="card mb-4">
              <div className="card-header">
                <h2>Paso 2: Datos del Producto</h2>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="year" className="form-label">Year</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.data.year}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    value={formData.data.price}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="CPU model" className="form-label">CPU Model</label>
                  <input
                    type="text"
                    id="CPU model"
                    name="CPU model"
                    value={formData.data['CPU model']}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Hard disk size" className="form-label">Hard Disk Size</label>
                  <input
                    type="text"
                    id="Hard disk size"
                    name="Hard disk size"
                    value={formData.data['Hard disk size']}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    Atrás
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                    disabled={
                      !formData.data.year ||
                      !formData.data.price ||
                      !formData.data['CPU model'] ||
                      !formData.data['Hard disk size']
                    }
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Revisión y envío */}
          {step === 3 && (
            <div className="card mb-4">
              <div className="card-header">
                <h2>Paso 3: Revisar y Guardar</h2>
              </div>
              <div className="card-body">
                <pre className="bg-light p-3">{JSON.stringify(formData, null, 2)}</pre>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    Atrás
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar Producto
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        {postResult && (
          <div className="alert alert-info mt-4">
            <h3>Resultado del POST:</h3>
            <pre>{JSON.stringify(postResult, null, 2)}</pre>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4">
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </>
  );
}
