import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../GlobalFiles/Sidebar';

const Diagnosis = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <Sidebar />
      <div className="row w-100 justify-content-center">
          <h1 className='fw-bold m-4' style={{color:"#1998AE"}}>Diagnosis</h1>
        <div className="col-md-4">
          <Link to="/createslip" className="text-decoration-none">
            <div className="card text-center shadow p-5 mb-4 bg-primary text-white rounded clickable-box">
              <h2>OPD</h2>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/admitpatient" className="text-decoration-none">
            <div className="card text-center shadow p-5 mb-4 bg-success text-white rounded clickable-box">
              <h2>IPD</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
