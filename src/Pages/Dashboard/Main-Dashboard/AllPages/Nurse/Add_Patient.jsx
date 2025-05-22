import React, { useEffect, useState } from "react";
import { message, Upload } from "antd";
import doctor from "../../../../../img/doctoravatar.png";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AddPatients,
  CreateBeds,
  EditSingleBed,
  GetSingleBed,
} from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { Navigate } from "react-router-dom";
import axios from "axios";
const url="https://nhd-server.vercel.app"
const notify = (text) => toast(text);

const Add_Patient = () => {
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const dispatch = useDispatch();

  const { data } = useSelector((store) => store.auth);

  // avaiable beds as the dropdown list

  const [availableBeds, setAvailableBeds] = useState([]);

  const fetchAvailableBeds = async () => {
    try {
      const response = await axios.get(`${url}/beds/available`);
      setAvailableBeds(response.data);
      
    } catch (error) {
      console.error("Error fetching available beds", error);
      notify("Error fetching available beds");
    }
  };

  useEffect(() => {
    fetchAvailableBeds();
    
  }, []);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let response = await fetch(`${url}/doctors/`); // Update with your correct API URL
        let data = await response.json();
        
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
    
  }, []);

 

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

  const InitData = {
    patientName: "",
    patientID: "",
    age: "",
    email: "",
    gender: "",
    mobile: "",
    emergencyNo: "",
    disease: "",
    address: "",
    department: "",
    date: new Date(),
    bloodGroup: "",
    DOB: "",
    password: "",
    nurseID: data?.user._id,
    docID: "",
    details: "",
    ward: "",
  };
  const [AddPatient, setAddPatient] = useState(InitData);

  const HandleAppointment = (e) => {
    setAddPatient({ ...AddPatient, [e.target.name]: e.target.value });
  };

  const HandleOnsubmitAppointment = async (e) => {
    e.preventDefault();
  
    if (
      AddPatient.gender === "" ||
      AddPatient.ward === "" ||
      AddPatient.docID === "" ||
      AddPatient.bloodGroup === "" ||
      AddPatient.patientID === ""
    ) {
      return notify("Please Enter All the Required Fields");
    }
  
    try {
      setLoading(true);
  
      const res = await dispatch(GetSingleBed(bedDetails));
  
      if (res.message === "Bed not found" || res.message === "No Bed") {
        notify("Bed not found");
        setLoading(false);
        return;
      }
  
      if (res.message === "Occupied") {
        notify("Bed already occupied");
        setLoading(false);
        return;
      }
  
      if (res.message === "Available") {
        const item = await dispatch(AddPatients(AddPatient));
  
        if (item.message === "Patient already exists") {
          notify("Patient already exists");
          setLoading(false);
          return;
        }
  
        const data = {
          patientID: item._id,
          occupied: "occupied",
        };
  
        notify("Patient Added");
  
        const ele = await dispatch(EditSingleBed(data, res.id));
        
        notify("Bed updated");
  
        setAddPatient(InitData);
        setbedDetails(initBed);
      }
  
      setLoading(false);
    } catch (error) {
      // Log the error object to see its structure
      console.log("Full Error:", error);

      // Check if error.response is available, then get the message
      if (error.response) {
        console.log("Response Error:", error.response); // Debug response
  
        const message = error?.response?.data?.message || "Something went wrong";
        toast.error(message); // Show error message from backend if available
      } else {
        // If no response, it's likely a network error or something unexpected
        toast.error("This patient already admited...");
      }
  
      setLoading(false);
    }
  };
  
  
  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "nurse") {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1 style={{ color: "#199A8E" }}>Add Patient</h1>
            <img src={doctor} alt="doctor" className="avatarimg" />

            <form onSubmit={HandleOnsubmitAppointment}>
              {/* custom id generating here */}
              <div>
                <label>CNIC</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Enter CNIC without dashes"
                    name="patientID"
                    value={AddPatient.patientID}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* Name PlaceHolder */}
              <div>
                <label>Patient Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="patientName"
                    value={AddPatient.patientName}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* AGE PLACEHOLDER  */}
              <div>
                <label>Age</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={AddPatient.age}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* EMAIL PLACEHOLDER  */}
              <div>
                <label>Email</label>
                <div className="inputdiv">
                  <input
                    type="email"
                    placeholder="abc@abc.com"
                    name="email"
                    value={AddPatient.email}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* <div>
                <label>Date</label>
                <div className="inputdiv">
                  <input
                    type="date"
                    placeholder="abc@abc.com"
                    name="date"
                    value={AddPatient.date}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div> */}
              {/* GENDER PLACEHOLDER  */}
              <div>
                <label>Gender</label>
                <div className="inputdiv">
                  <select
                    name="gender"
                    value={AddPatient.gender}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {/* DATE OF BIRTH  */}
              <div className="dateofAppointment">
                <p>Birth Date</p>
                <div className="inputdiv">
                  <input
                    type={"date"}
                    placeholder="Choose Date"
                    name="DOB"
                    value={AddPatient.DOB}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              {/* MOBILE PLACEHOLDER */}
              <div>
                <label>Contact Number</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Number"
                    name="mobile"
                    value={AddPatient.mobile}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Emergency Mobile</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Mobile"
                    name="emergencyNo"
                    value={AddPatient.emergencyNo}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Details</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Details"
                    name="details"
                    value={AddPatient.details}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              <div>
                <label>Disease</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Disease"
                    name="disease"
                    value={AddPatient.disease}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>

              {/* ADDRESS SECTION  */}
              <div>
                <label>Address</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Address line 1"
                    name="address"
                    value={AddPatient.address}
                    onChange={HandleAppointment}
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
                    value={AddPatient.ward}
                    onChange={HandleAppointment}
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
                    name="roomNumber"
                    value={bedDetails.roomNumber}
                    onChange={HandleBedchange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Doctor</label>
                <div className="inputdiv">
                  <select
                    className="p-2"
                    name="docID"
                    value={AddPatient.docID}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.docName} - {doctor.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label>Patient Blood Group</label>
                <div className="inputdiv">
                  <select
                    name="bloodGroup"
                    value={AddPatient.bloodGroup}
                    onChange={HandleAppointment}
                    required
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              {/* PASSWORD*/}
              <div className="dateofAppointment">
                <p>Password</p>
                <div className="inputdiv">
                  <input
                    type={"text"}
                    placeholder="Password"
                    name="password"
                    value={AddPatient.password}
                    onChange={HandleAppointment}
                    required
                  />
                </div>
              </div>
             
              {/* SUBMIT BUTTON  */}

              <button
                type="submit"
                className="formsubmitbutton"
                style={{
                  width: "40%",
                  backgroundColor: "#199A8E",
                  padding: "10px",
                }}
              >
                {loading ? "Loading..." : "Add"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Patient;
