import React, { useEffect, useState } from "react";
import Sidebar from "../../GlobalFiles/Sidebar";
import doctor from "../../../../../img/doctoravatar.png";
import axios from "axios";
const notify = (text) => toast(text);
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
 const url = "https://nhd-server.vercel.app";

const AdmitPatientForm = () => {
  const [ReportValue, setReportValue] = useState({
    patientID: "",
    patientName: "",
    age: "",
    gender: "",
    mobile: "",
    emergencyNo: "",
    bloodGroup: "",
    email: "",
    ward: "",
    bedNumber: "",
    reasonForAdmission: "",
    guardianName: "",
    guardianContact: "",
    doctorAssigned: "",
    docID: "",
    nurseID: "",
    DOB: "",
    address: "",
    disease: "",
    test: "",
    department: "",
    roomNo: "",
  });

  const [availableBeds, setAvailableBeds] = useState([]);
  const [availableDoctor, setAvailableDoctor] = useState([]);

  const fetchAvailableBeds = async () => {
    try {
      const response = await axios.get(`${url}/beds/available`);
      setAvailableBeds(response.data);
    } catch (error) {
      console.error("Error fetching available beds", error);
      notify("Error fetching available beds");
    }
  };

  ///fetching available doctors

  const fetchAvailableDoctor = async () => {
    try {
      const response = await axios.get(`${url}/doctors/`);
      setAvailableDoctor(response.data);
    } catch (error) {
      console.error("Error fetching available doctors", error);
      notify("Error fetching available doctors");
    }
  };

  useEffect(() => {
    fetchAvailableBeds();
    fetchAvailableDoctor();
  }, []);



  const HandleReportChange = (e) => {
    setReportValue({ ...ReportValue, [e.target.name]: e.target.value });
  };

  const HandleReportSubmit = async (e) => {
    try {
      e.preventDefault();

      const ipdData = {
        ...ReportValue,
        bedNumber: bedDetails.bedNumber,
        roomNo: bedDetails.roomNumber,
        docID: ReportValue.docID,
      };

      try {
        const ipdResponse = await axios.post(
          `${url}/patients/admitPatient`,
          ipdData
        );

        if (ipdResponse.data.message == "Patient admitted successfully.") {
          toast.success(
            ipdResponse.data.message || "Patient admitted successfully"
          );
           // Reseting Form
      setReportValue({
        patientID: "",
        patientName: "",
        age: "",
        gender: "",
        mobile: "",
        emergencyNo: "",
        bloodGroup: "",
        email: "",
        ward: "",
        bedNumber: "",
        reasonForAdmission: "",
        guardianName: "",
        guardianContact: "",
        doctorAssigned: "",
        docID: "",
        nurseID: "",
        DOB: "",
        address: "",
        disease: "",
        test: "",
        department: "",
        roomNo: "",
      });
      setbedDetails(initBed);
        } else {
          toast.error(
            ipdResponse.data.message || "Patient Already admitted..."
          );
        }

        // If IPD succeeds, then save to medical history

        // Optional: reset form here
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.response?.data?.message || "Failed to admit patient");
      }


    } catch (error) {
      console.log(error);
    }
  };
  // handle bed change
  const initBed = {
    bedNumber: "",
    roomNumber: "",
  };
  const [bedDetails, setbedDetails] = useState(initBed);

  const HandleBedchange = (e) => {
    // setbedDetails({ ...bedDetails, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setbedDetails((prev) => {
      if (name === "bedNumber") {
        const selectedBed = availableBeds.find((bed) => bed.bedNumber == value);
        return {
          ...prev,
          bedNumber: value,
          roomNumber: selectedBed.roomNumber,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  
  const doctorInfo = useSelector((state) => state.auth.data.user);

  // Then auto-fill doctor on patient admission
  useEffect(() => {
    if (doctorInfo && doctorInfo.userType === "doctor") {
      setReportValue((prev) => ({
        ...prev,
        doctorAssigned: doctorInfo.docName,
        // docID: doctorInfo.docID,
      }));
    }
  }, [doctorInfo]);

  // autofill logic taking place
  const fetchPatientDetails = async (cnic) => {
    if (cnic.length < 13) return; // wait until CNIC is fully typed

    try {
      const res = await axios.get(`${url}/patients/${cnic}`);
      const { patient } = res.data;
      
      setReportValue((prev) => ({
        ...prev,
        patientName: patient.patientName || "",
        age: patient.age || "",
        mobile: patient.mobile || "",
        email: patient.email || "",
        gender: patient.gender || "",
        emergencyNo: patient.emergencyNo || "",
        bloodGroup: patient.bloodGroup || "",
      }));

      notify("Patient details auto-filled");
    } catch (err) {
      console.error(err);
      notify("This is New Patient...");
    }
  };
  useEffect(() => {
    const cnic = ReportValue.patientID;
    if (cnic.length === 13) {
      fetchPatientDetails(cnic);
    }
  }, [ReportValue.patientID]);

  return (
    <>
      <ToastContainer />

      <div className="container">
        <Sidebar />
        <div className="container-fluid d-flex justify-content-center">
          <div>
            <div className="container shadow-lg m-5 p-5">
              <form onSubmit={HandleReportSubmit}>
                <h2
                  className="text-center fw-bold"
                  style={{ color: "#199A8E" }}
                >
                  Admit Patient
                </h2>
                <div className="text-center container-fluid">
                  <img
                    src={doctor}
                    alt="doctor"
                    className="avatarimg mx-auto"
                    style={{
                      width: "70px",
                      height: "70px",
                      display: "block",
                      textAlign: "center",
                    }}
                  />
                </div>
                <div className="container-fluid w-100">
                  <label>Patient ID</label>
                  <div className="inputdiv">
                    <input
                      type="number"
                      name="patientID"
                      placeholder="CNIC"
                      value={ReportValue.patientID}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Patient Name</label>
                  <div className="inputdiv">
                    <input
                      type="text"
                      name="patientName"
                      placeholder="Patient Name"
                      value={ReportValue.patientName}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Age</label>
                  <div className="inputdiv">
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter age"
                      value={ReportValue.age}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Gender</label>
                  <div className="inputdiv">
                    <select
                      name="gender"
                      value={ReportValue.gender}
                      onChange={HandleReportChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Mobile</label>
                  <div className="inputdiv">
                    <input
                      type="number"
                      name="mobile"
                      placeholder="Enter Mobile No"
                      value={ReportValue.mobile}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Emergency No</label>
                  <div className="inputdiv">
                    <input
                      type="number"
                      name="emergencyNo"
                      placeholder="Enter Any Emergency No"
                      value={ReportValue.emergencyNo}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label>Blood Group</label>
                  <div className="inputdiv">
                    <select
                      name="bloodGroup"
                      value={ReportValue.bloodGroup}
                      onChange={HandleReportChange}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Email</label>
                  <div className="inputdiv">
                    <input
                      type="email"
                      name="email"
                      placeholder="email@gmail.com"
                      value={ReportValue.email}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>

                {/* ward section below */}
                <div>
                  <label>Ward</label>
                  <div className="inputdiv">
                    <select
                      name="ward"
                      value={ReportValue.ward}
                      onChange={HandleReportChange}
                      required
                    >
                      <option value="">Select Ward</option>
                      <option value="Cardio Ward">Cardio Ward</option>
                      <option value="Neuro Ward">Neuro Ward</option>
                      <option value="ENT Ward">ENT Ward</option>
                      <option value="General Ward">General Ward</option>
                      <option value="Oncology Ward">Oncology Ward</option>
                      <option value="Pediatrics Ward">Pediatrics Ward</option>
                      <option value="Psych Ward">Psych Ward</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Bed Number</label>
                  <div className="inputdiv">
                    <select
                      name="bedNumber"
                      value={bedDetails.bedNumber}
                      onChange={HandleBedchange}
                      required
                    >
                      <option value="">Select Bed</option>
                      {availableBeds.map((bed) => (
                        <option
                          key={bed.id}
                          value={bed.bedNumber}
                          disabled={bed.occupied !== "available"}
                        >
                          Bed {bed.bedNumber} - Room {bed.roomNumber} - Ward (
                          {bed.ward}) ({bed.occupied})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label>Room Number</label>
                  <div className="inputdiv">
                    <input
                      type="number"
                      placeholder="room no"
                      name="roomNo"
                      value={bedDetails.roomNumber}
                      onChange={HandleBedchange}
                      required
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label>Reason for Admission</label>
                  <div className="inputdiv">
                    <textarea
                      name="reasonForAdmission"
                      placeholder="Surgery,ICU etc"
                      value={ReportValue.reasonForAdmission}
                      onChange={HandleReportChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label>Guardian Name</label>
                  <div className="inputdiv">
                    <input
                      type="text"
                      name="guardianName"
                      placeholder="Enter Guardian Name"
                      value={ReportValue.guardianName}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label>Guardian Contact</label>
                  <div className="inputdiv">
                    <input
                      type="number"
                      name="guardianContact"
                      placeholder="Guardian Contact"
                      value={ReportValue.guardianContact}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label>Assigned Doctor</label>
                  <div className="inputdiv">
                    <input
                      type="text"
                      name="doctorAssigned"
                      value={ReportValue.doctorAssigned}
                      readOnly
                    />
                  </div>
                </div>

                {/* <div>
                  <label>Date of Birth</label>
                  <div className="inputdiv">
                    <input
                      type="date"
                      name="DOB"
                      value={patientDetails.DOB}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div> */}

                <div>
                  <label>Address</label>
                  <div className="inputdiv">
                    <textarea
                      name="address"
                      placeholder="Permanent Address"
                      value={ReportValue.address}
                      onChange={HandleReportChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label>Disease</label>
                  <div className="inputdiv">
                    <input
                      type="text"
                      name="disease"
                      placeholder="Specific Disease"
                      value={ReportValue.disease}
                      onChange={HandleReportChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label>Test Performed</label>
                  <div className="inputdiv">
                    <textarea
                      name="test"
                      value={ReportValue.test}
                      placeholder="test performed"
                      onChange={HandleReportChange}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* <div>
                  <label>Department</label>
                  <div className="inputdiv">
                    <input
                      type="text"
                      name="department"
                      placeholder="Cardio,Psyc etc"
                      value={patientDetails.department}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div> */}

                <div className="align-content-center mx-auto w-25">
                  <button
                    className="rounded-2 w-100 m-3 p-1"
                    type="submit"
                    onClick={HandleReportSubmit}
                  >
                    Admit Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmitPatientForm;
