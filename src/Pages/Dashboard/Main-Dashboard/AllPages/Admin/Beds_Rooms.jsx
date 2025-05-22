import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { dischargePatient, GetBeds } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import "./CSS/Beds.css";
import axios from "axios";
 const url = "https://nhd-server.vercel.app";
const Beds_Rooms = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { beds } = useSelector((state) => state.data);

  // 🆕 For ward selection
  const [selectedWard, setSelectedWard] = useState("All");
  const [admittedPatients, setAdmittedPatients] = useState([]);

  useEffect(() => {
    dispatch(GetBeds());
  }, [dispatch]);

  // test line
  useEffect(() => {}, [beds]);
 
 
  const DischargePatient = async (_id) => {
    const bed = beds.find((b) => b._id === _id);

    // Dispatch to mark bed as available
    dispatch(dischargePatient({ occupied: "available", _id }));

    // Find admitted patient in that bed
    const patient = admittedPatients.find(
      (p) =>
        String(p.bedNumber) === String(bed?.bedNumber) &&
        String(p.roomNo) === String(bed?.roomNumber) &&
        p.ward?.toLowerCase() === bed?.ward?.toLowerCase() &&
        p.admitted === true
    );

    // Discharge if patient found
    if (patient) {
      try {
        await axios.post(`${url}/patients/discharge`, {
          patientID: patient._id,
          bedNumber: patient.bedNumber,
          roomNo: patient.roomNo,
        });

        // Remove patient from state immediately (optional)
        setAdmittedPatients((prev) =>
          prev.filter((p) => String(p._id) !== String(patient._id))
        );

        // Re-fetch updated patient list
        fetchAdmittedPatients();
      } catch (err) {
        console.error("Error discharging patient:", err);
      }
    }
  };

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  // 🧠 Unique ward names from beds
  const wards = ["All", ...new Set(beds.map((bed) => bed.ward))];

  // 🧼 Filter beds by selected ward
  const filteredBeds =
    selectedWard === "All"
      ? beds
      : beds.filter((bed) => bed.ward === selectedWard);

  const fetchAdmittedPatients = async () => {
    try {
      const response = await axios.get(`${url}/patients/ipdpatients`);

      setAdmittedPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
    dispatch(GetBeds());
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
            <h1 style={{ marginBottom: "2rem", color: "#199A8E" }}>All Beds</h1>

            {/*  Ward Filter Dropdown */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="ward-select"
                style={{ marginRight: "10px", fontWeight: "bold" }}
              >
                Filter by Ward:
              </label>
              <select
                id="ward-select"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
              >
                {wards.map((ward, i) => (
                  <option key={i} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            {/*  Beds Table */}
            <div className="patientBox">
              <table>
                <thead>
                  <tr>
                    <th>Ward</th>
                    <th>Room</th>
                    <th>Bed</th>
                    <th>Status</th>
                    <th>CNIC</th> {/* */}
                    <th>Patient Name</th>
                    <th className="action">Discharge</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBeds.map((ele, idx) => {
                    const admittedPatient = admittedPatients.find(
                      (p) =>
                        String(p.bedNumber) === String(ele.bedNumber) &&
                        String(p.roomNo) === String(ele.roomNumber) &&
                        p.ward
                          ?.toLowerCase()
                          .includes(ele.ward?.toLowerCase()) && // relaxed match
                        p.admitted === true
                    );

                    return (
                      <tr key={idx}>
                        <td>{ele.ward || "N/A"}</td>
                        <td>{ele.roomNumber}</td>
                        <td>{ele.bedNumber}</td>
                        <td
                          style={{
                            color:
                              ele.occupied === "available" ? "green" : "orange",
                            fontWeight: "bold",
                          }}
                        >
                          {ele.occupied}
                        </td>
                        <td>{admittedPatient?.patientID || ""}</td>
                        <td>{admittedPatient?.patientName || ""}</td>

                        {/* CNIC */}
                        <td>
                          <button
                            disabled={ele.occupied === "available"}
                            style={{
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              color:
                                ele.occupied === "available" ? "gray" : "red",
                              cursor:
                                ele.occupied === "available"
                                  ? "default"
                                  : "pointer",
                            }}
                            onClick={() => DischargePatient(ele._id)}
                          >
                            Discharge
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* No beds found message */}
              {filteredBeds.length === 0 && (
                <p style={{ marginTop: "1rem", color: "gray" }}>
                  No beds found for selected ward.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Beds_Rooms;
