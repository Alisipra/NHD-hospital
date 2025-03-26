import React, {  useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import styles from "../medicalhistory/History.module.css"
const SearchPatientHistory = () => {
  const [cnic, setCnic] = useState("");
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  
const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:1000/history/${cnic}`);
      if (response.data.patient) {
        setPatient(response.data.patient);
        setHistory(Array.isArray(response.data.history) ? response.data.history : []);
        toast.success("Patient found successfully!");
      } else {
        setPatient(null);
        setHistory([]);
        console.log("Patient does not exist");
        toast.error("Patient not found!");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Patient not found");
        toast.warn("Patient with this CNIC does not exist.");
        setPatient(null);
        setHistory([]);
      } else {
        console.error("Error fetching patient history", error);
        toast.error("Server error. Please try again later.");
      }
     }
  };
  useEffect(() => {
    const updateHistoryListener = (event) => {
      setHistory((prevHistory) => [event.detail, ...prevHistory]);
    };
  
    window.addEventListener("updateHistory", updateHistoryListener);
    return () => window.removeEventListener("updateHistory", updateHistoryListener);
  }, []);
  
  return (
//     <div className="container">
//       <h1>Search Patient History</h1>
//       <ToastContainer />
//       <input
//         type="text"
//         value={cnic}
//         placeholder="Enter CNIC"
//         onChange={(e) => setCnic(e.target.value)}
//       />
//       <button onClick={handleSearch} >Search</button>
//       {patient ? (
//   <div>
//     <h3>Patient Details:</h3>
//     <p>Name: {patient.patientName}</p>
//     <p>Age: {patient.age}</p>
//     <p>Disease: {patient.disease}</p>
//   </div>
// ) : (
//   <h2>This is a New Patient...</h2>
// )}

// <h3>Medical History:</h3>
// {history && history.length > 0 ? (
//   history.map((record) => (
//     <div key={record._id}>
//       <p>Visit Date: {new Date(record.visitDate).toDateString()}</p>
//       <p>Diagnosis: {record.diagnosis}</p>
//       <p>Prescription: {record.prescription}</p>
//       <p>Tests: {record.tests?.join(" / ")}</p>
//     </div>
//   ))
// ) : (
//   <p>No history found.</p>
// )}

//   </div>
  
 <div className={styles.container}>
<h1>Search Patient History</h1>
<ToastContainer />

<input
  type="text"
  value={cnic}
  placeholder="Enter CNIC"
  onChange={(e) => setCnic(e.target.value)}
/>

<button onClick={handleSearch}>Search</button>

{patient ? (
  <div className={styles.patientDetails}>
    <h3>Patient Details:</h3>
    <p><strong>Name:</strong> {patient.patientName}</p>
    <p><strong>Age:</strong> {patient.age}</p>
    <p><strong>Disease:</strong> {patient.disease}</p>
  </div>
) : (
  ""
)}

<div className={styles.historyContainer}>
  <h3>Medical History:</h3>
  {history && history.length > 0 ? (
    history.map((record) => (
      <div key={record._id} className={styles.historyCard}>
        <p><strong>Visit Date:</strong> {new Date(record.visitDate).toDateString()}</p>
        <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
        <p><strong>Prescription:</strong> {record.prescription}</p>
        <p><strong>Tests:</strong> {record.tests?.join(" / ")}</p>
      </div>
    ))
  ) : (
    <p className={styles.noHistory}>No history found.</p>
  )}
</div>
</div> 
  )
 
  
};
// modified code


export default SearchPatientHistory;
