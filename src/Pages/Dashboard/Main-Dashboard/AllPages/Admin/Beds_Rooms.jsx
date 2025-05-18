import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { dischargePatient, GetBeds } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import "./CSS/Beds.css";

const Beds_Rooms = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { beds } = useSelector((state) => state.data);

  // 🆕 For ward selection
  const [selectedWard, setSelectedWard] = useState("All");

  useEffect(() => {
    dispatch(GetBeds());
  }, [dispatch]);

  // test line
  useEffect(() => {
    
  }, [beds]);
  const DischargePatient = (_id) => {
    const data = {
      occupied: "available",
      _id,
    };
    dispatch(dischargePatient(data));
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

  return (
    <>
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Payment_Page">
            <h1 style={{ marginBottom: "2rem", color: "#199A8E" }}>All Beds</h1>

            {/* 🆕 Ward Filter Dropdown */}
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

            {/* 🛏️ Beds Table */}
            <div className="patientBox">
              <table>
                <thead>
                  <tr>
                    <th>Ward</th>
                    <th>Room</th>
                    <th>Bed</th>
                    <th>Status</th>
                    <th className="action">Discharge</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeds.map((ele, idx) => (
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
                      {/* <td>{ele.patientID?.patientName || "N/A"}</td>
                      <td>{ele.patientID?.disease || "N/A"}</td>
                      <td>{ele.patientID?.docID?.docName || "N/A"}</td> */}
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
                  ))}
                </tbody>
              </table>

              {/* 🛑 No beds found message */}
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
