import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllReports } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import axios from "axios";
 const url = "https://nhd-server.vercel.app";

const AllReport = () => {
  const dispatch = useDispatch();
  const [admittedPatients, setAdmittedPatients] = useState([]);

  // Fetch all admitted patients
  const fetchAdmittedPatients = async () => {
    try {
      const response = await axios.get(`${url}/patients/ipdpatients`);
      setAdmittedPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Discharge a patient
  const dischargeAdmittedPatient = async (patientId) => {
    try {
      // Example using DELETE method — change if your API differs
      await axios.delete(`${url}/patients/discharge/${patientId}`);

      // After successful discharge, fetch updated list
      fetchAdmittedPatients();

      alert("Patient discharged successfully.");
    } catch (error) {
      console.error("Error discharging patient:", error);
      alert("Failed to discharge the patient.");
    }
  };

  useEffect(() => {
    fetchAdmittedPatients();
  }, []);

  return (
    <>
      <div className="container">
        <Sidebar />

        <div className="AfterSideBar">
          <div className="Payment_Page">
            <h1 style={{ marginBottom: "2rem" }}>All Admitted Patients</h1>
            <div className="patientBox">
              <table>
                <thead>
                  <tr>
                    <th>Patient CNIC</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Reason To Admit</th>
                    <th>Admission Date</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admittedPatients?.map((ele) => (
                    <tr key={ele._id}>
                      <td>{ele.patientID}</td>
                      <td>{ele.patientName}</td>
                      <td>{ele.doctorAssigned}</td>
                      <td>{ele.reasonForAdmission}</td>
                      <td>
                        {new Date(ele.admissionDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>{ele.gender}</td>
                      <td>
                        <button
                          onClick={() => dischargeAdmittedPatient(ele._id)}
                          style={{ backgroundColor: "crimson", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
                        >
                          Discharge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllReport;
