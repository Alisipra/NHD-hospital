import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CreateReport } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import DiagnosisInput from "./DiagnosisInput";
const notify = (text) => toast(text);

const Discharge_and_Create_Slip = () => {
  const { data } = useSelector((store) => store.auth);
  const doctor = useSelector((state) => state.auth.data.user); // Get doctor info
   
   

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const initmed = {
    medName: "",
    dosage: "",
    duration: "",
  };
  const [med, setmed] = useState(initmed);

  const [medicines, setmedicines] = useState([]);

  const HandleMedChange = (e) => {
    setmed({ ...med, [e.target.name]: e.target.value });
  };

  const InitData = {
    patientID: "",
    docName: "",
    docDepartment: "",
    patientAge: "",
    docMobile: "",
    patientMobile: "",
    patientBloodGroup: "",
    patientGender: "",
    email: "",
    patientDisease: "",
    patientTemperature: "",
    patientWeight: "",
    patientBP: "",
    patientGlucose: "",
    patientName: "",
    extrainfo: "",
    tests:"",
    date: new Date(),
    time: "",
   medicines: [],
  };

  const [ReportValue, setReportValue] = useState(InitData);

  const HandleReportChange = (e) => {
    setReportValue({ ...ReportValue, [e.target.name]: e.target.value });
  };

  const HandleMedAdd = (e) => {
    e.preventDefault();
    setmedicines([...medicines, med]);
    setmed(initmed);
  };

  // const HandleReportSubmit = async(e) => {
  //   e.preventDefault();
  //   let data = {
  //     ...ReportValue,
  //     medicines,
  //   }

  //   try {
  //     setLoading(true);
  //     dispatch(CreateReport(data)).then(async(res) => {
  //       if (res.message === "Report created successfully.") {
  //         notify("Report Created Sucessfully");
  //         setLoading(false);
  //         setReportValue(InitData);
  //         setmedicines([]);
          
          
  //          // Prepare medical history data
  //       const historyData = {
  //       patientID: ReportValue.patientID,
  //       doctorID: doctor._id, // Assuming logged-in doctor info is available
  //       diagnosis: ReportValue.extrainfo || "Diagnosis not provided",
  //       prescription: medicines.map(med => `${med.medName} (${med.dosage} - ${med.duration})`).join(", "),
  //       tests: ReportValue.tests || "No tests conducted",
  //       notes: ReportValue.extrainfo || "No additional notes",
  //     }
      

  //      // Send medical history update
  //      await axios.post("http://localhost:1000/history/add", historyData);
  //      notify("Medical History Updated");
  //      // Trigger update event for SearchPatientHistory
  //      window.dispatchEvent(new CustomEvent("updateHistory", { detail: historyData }));
 
  //       } else {
  //         setLoading(false);
  //         notify("Something went Wrong");
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const HandleReportSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure doctor and patient IDs are present
    if (!doctor?._id || !ReportValue.patientID) {
      notify("Missing doctor or patient ID");
      return;
    }
  
    const data = { ...ReportValue, medicines };
  
    try {
      setLoading(true);
      const res = await dispatch(CreateReport(data));
      

      
      // checking valid cnic should be here to proced
      if (res.message === "Patient not found.") {
        notify("Patient ID not found. Please enter a valid Patient CNIC.");
        setLoading(false);
        return;
      }
      if (res.message == "Report created successfully") {
        notify("Report Created Successfully");
  
        // Prepare and send medical history
        const historyData = {
          patientID: ReportValue.patientID,
          doctorID: doctor._id,
          diagnosis: ReportValue.extrainfo || "Diagnosis not provided",
          prescription: medicines
            .map((med) => `${med.medName} (${med.dosage} - ${med.duration})`)
            .join(", "),
          tests: ReportValue.tests || "No tests conducted",
          notes: ReportValue.extrainfo || "No additional notes",
        };
  
        await axios.post("http://localhost:1000/history/add", historyData);
        notify("Medical History Updated");
  
        // Trigger history update event
        window.dispatchEvent(new CustomEvent("updateHistory", { detail: historyData }));
  
        // Reset form
        setReportValue(InitData);
        setmedicines([]);
      } else {
        notify("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      notify("Error submitting report");
    } finally {
      setLoading(false);
    }
  };
  

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "doctor") {
    return <Navigate to={"/dashboard"} />;
  }
  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Create Report</h1>
            <form>
              <div>
                <label>Patient CNIC </label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="CNIC without dashes"
                    name="patientID"
                    value={ReportValue.patientID}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Doctor Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="docName"
                    value={ReportValue.docName}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Department</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Department"
                    name="docDepartment"
                    value={ReportValue.docDepartment}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Doctor Mobile</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="No"
                    name="docMobile"
                    value={ReportValue.docMobile}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Patient Name</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Name"
                    name="patientName"
                    value={ReportValue.patientName}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Patient Age</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Age"
                    name="patientAge"
                    value={ReportValue.patientAge}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Patient Mobile</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="Mobile"
                    name="patientMobile"
                    value={ReportValue.patientMobile}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Email</label>
                <div className="inputdiv">
                  <input
                    type="email"
                    placeholder="abc@abc"
                    name="email"
                    value={ReportValue.email}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Patient Gender</label>
                <div className="inputdiv">
                  <select
                    name="patientGender"
                    value={ReportValue.patientGender}
                    onChange={HandleReportChange}
                  >
                    <option value="Choose Gender">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Patient Blood Group</label>
                <div className="inputdiv">
                  <select
                    name="patientBloodGroup"
                    value={ReportValue.patientBloodGroup}
                    onChange={HandleReportChange}
                    required
                  >
                    <option value="Choose Blood Group">Select</option>
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
              <div>
                <label>Patient Disease</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Disease"
                    name="patientDisease"
                    value={ReportValue.patientDisease}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Patient Temperature</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="99^C"
                    name="patientTemperature"
                    value={ReportValue.patientTemperature}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>

              <div>
                <label>Patient Weight</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="75 KG"
                    name="patientWeight"
                    value={ReportValue.patientWeight}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Patient BP</label>
                <div className="inputdiv adressdiv">
                  <input
                    type="number"
                    placeholder="140/90 mmHg"
                    name="patientBP"
                    value={ReportValue.patientBP}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Patient Glucose</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="99 mg/dL"
                    name="patientGlucose"
                    value={ReportValue.patientGlucose}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                
                <div className="inputdiv">
                <DiagnosisInput ReportValue={ReportValue} HandleReportChange={HandleReportChange} className="codes"/>
                </div>
              </div>
              
              

              
              {/* ******************************************** */}
              <div>
                <label>Medicines</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="PCM"
                    name="medName"
                    value={med.medName}
                    onChange={HandleMedChange}
                  />
                  <select name="duration" onChange={HandleMedChange}>
                    <option value="Dosage">Duration</option>
                    <option value="After Meal">After Meal</option>
                    <option value="Before Meal">Before Meal</option>
                  </select>
                  <select name="dosage" onChange={HandleMedChange}>
                    <option value="Dosage">Dosage</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <input type="submit" value={"Add"} onClick={HandleMedAdd} />
                </div>
              </div>
              {/* *********************************** */}
              <div>
                <label>Tests</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="tests conducted"
                    name="tests"
                    value={ReportValue.tests}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              {/* <div>
                <label>Date</label>
                <div className="inputdiv">
                  <input
                    type="date"
                    placeholder="dd-mm-yyyy"
                    name="date"
                    value={ReportValue.date}
                    onChange={HandleReportChange}
                  />
                </div>
              </div> */}
              <div>
                <label>Time</label>
                <div className="inputdiv">
                  <input
                    type="time"
                    name="time"
                    value={ReportValue.time}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>

              <button
                className="formsubmitbutton bookingbutton"
                onClick={HandleReportSubmit}
              >
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
// modified code

export default Discharge_and_Create_Slip;
