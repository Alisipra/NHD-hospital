import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import styles from "../medicalhistory/History.module.css";
import Sidebar from "../../../GlobalFiles/Sidebar";
const url = "https://nhd-server.vercel.app";
const SearchPatientHistory = () => {
  const [cnic, setCnic] = useState("");
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = history.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(history.length / recordsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${url}/history/${cnic}`);
      if (response.data.patient) {
        setPatient(response.data.patient);
        setHistory(
          Array.isArray(response.data.history) ? response.data.history : []
        );
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
    return () =>
      window.removeEventListener("updateHistory", updateHistoryListener);
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar Column */}
          <div className="col-md-2 col-12 mb-3">
            <Sidebar />
          </div>

          {/* Main Content Column */}
          <div className="col-md-10 col-12 ">
            <div className={`${styles.container} py-4`}>
              <h1 className="text-center mb-4">Search Patient History</h1>
              <ToastContainer />

              {/* Search Input */}
              <div className="mb-4 d-flex flex-column flex-md-row align-items-center gap-2">
                <input
                  type="text"
                  value={cnic}
                  placeholder="Enter CNIC"
                  className="form-control"
                  onChange={(e) => setCnic(e.target.value)}
                />
                <button className="btn btn-success w-25" onClick={handleSearch}>
                  Search
                </button>
              </div>

              {/* Patient Details */}
              {patient && (
                <div className={`${styles.patientDetails} mb-4`}>
                  <h3>Patient Details:</h3>
                  <p>
                    <strong>Name:</strong> {patient.patientName}
                  </p>
                  <p>
                    <strong>Age:</strong> {patient.age}
                  </p>
                  {/* <p><strong>Disease:</strong> {patient.disease}</p> */}
                </div>
              )}

              {/* Medical History */}
              <div className={styles.historyContainer}>
                <h3>Medical History:</h3>
                {history && history.length > 0 ? (
                  <>
                    {currentRecords.map((record) => (
                      <div
                        key={record._id}
                        className={`${styles.historyCard} mb-3`}
                      >
                        <p>
                          <strong>Visit Date:</strong>{" "}
                          {new Date(record.visitDate).toDateString()}
                        </p>
                        <p>
                          <strong>Diagnosis:</strong> {record.diagnosis}
                        </p>
                        <p>
                          <strong>Prescription:</strong> {record.prescription}
                        </p>
                        <p>
                          <strong>Tests:</strong>{" "}
                          {record.tests && record.tests.length > 0
                            ? record.tests.join(" / ")
                            : "no test conducted"}
                        </p>

                        <p>
                          <strong>Doctor:</strong>{" "}
                          {record.doctorID ? record.doctorID.docName : "N/A"}
                        </p>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-evenly">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="w-25"
                      >
                        Prev
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="w-25"
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <p className={styles.noHistory}>No history found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
// modified code

export default SearchPatientHistory;
