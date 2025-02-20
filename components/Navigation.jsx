import React from 'react'
import Link from "next/link";

function Navigation() {
  return (
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark text-white min-vh-100 p-5">
            <h4>Menú</h4>
            <ul className="nav flex-column col-md-12">
                <li className="nav-item p-2">
                    <Link className="btn btn-secondary  d-block w-100 btn-lg active" href="/">Home</Link>
                </li>
                <li className="nav-item p-2">
                    <Link className="btn btn-secondary d-block w-100 btn-lg active" href="/stepper">stepper</Link>
                </li>
                <li className="nav-item p-2">
                    <Link className="btn btn-secondary d-block w-100 btn-lg active" href="/services">Services</Link>
                </li>
            </ul>
        </nav>
  )
}
export default Navigation