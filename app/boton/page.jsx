"use client";
import { useState } from "react";
import "../globals.css";

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="container-fluid w-100">
            <div className="d-flex">
                {/* Sidebar con efecto de transición suave */}
                <div className={`sidebar bg-secondary text-white rounded-3 ${collapsed ? "collapsed" : ""}`}>
                    <p>COLUMNA PRUEBA</p>
                </div>

                {/* Contenido principal que se expande automáticamente */}
                <div className="w-100">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="btn btn-primary mb-4"
                    >
                        {collapsed ? "Mostrar Sidebar" : "Ocultar Sidebar"}
                    </button>
                    <p>Columna de 9 (Contenido Principal)</p>
                </div>
            </div>
        </div>
    );
}
