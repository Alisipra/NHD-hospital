import { Table } from "antd";
import React from "react";
import { MdPersonAdd } from "react-icons/md";
import { FaUserNurse } from "react-icons/fa";
import { RiEmpathizeLine } from "react-icons/ri";
import { FaBed } from "react-icons/fa";

import { FaAmbulance } from "react-icons/fa";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllData, GetBeds, GetPatients } from "../../../../Redux/Datas/action";

const FrontPage = () => {
  const columns = [
    { title: "Name", dataIndex: "patientName", key: "patientName" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Disease", dataIndex: "disease", key: "disease" },
    { title: "Blood Group", dataIndex: "bloodGroup", key: "bloodGroup" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];
  const { patients } = useSelector((store) => store.data.patients);
  const {
    dashboard: { data },
  } = useSelector((store) => store.data);

  

  const dispatch = useDispatch();
 useEffect(() => {
    dispatch(GetPatients());
    dispatch(GetAllData());
  }, []);
  useEffect(() => {
    dispatch(GetBeds());
  }, [dispatch]);

  const beds = useSelector((state) => state.data.beds);
  

  
  //  Defensive fallback to empty array
  const availableBeds = beds?.filter((bed) => bed.occupied === "available")?.length || 0;
  const occupiedBeds = beds?.filter((bed) => bed.occupied === "occupied")?.length || 0;

  
  return (

    
    <div className="container">
      <Sidebar />
      <div className="AfterSideBar">
        <h1 style={{ color: "#199A8E" }}>Overview</h1>
        <div className="maindiv">
          <div className="one commondiv">
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.doctor}</h1>
              <p>Doctor</p>
            </div>
            <MdPersonAdd className="overviewIcon" />
          </div>
          <div className="two commondiv" >
            {" "}
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.nurse}</h1>
              <p>Nurse</p>
            </div>
            <FaUserNurse className="overviewIcon" />
          </div>
          <div className="three commondiv">
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.patient}</h1>
              <p>Patient</p>
            </div>
            <RiEmpathizeLine className="overviewIcon" />
          </div>
          <div className="six commondiv">
            {" "}
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.admin}</h1>
              <p>Admin</p>
            </div>
            <RiAdminLine className="overviewIcon" />
          </div>

          {/* modifying available and occupeid */}
          {/* ///available rooms */}
          <div className="four commondiv">
            {" "}
            <div>
              {/* <h1 style={{color:"#199A8E"}}>{data?.bed}</h1> */}
              <h3>Beds</h3>
              <h5>Available: {availableBeds}</h5>
              <h5> Occupied: {occupiedBeds}</h5>
            </div>
            <FaBed className="overviewIcon" />
          </div>

          <div className="five commondiv">
            {" "}
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.ambulance}</h1>
              <p>Ambulance</p>
            </div>
            <FaAmbulance className="overviewIcon" />
          </div>
          <div className="six commondiv">
            {" "}
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.appointment}</h1>
              <p>Appointment</p>
            </div>
            <BsFillBookmarkCheckFill className="overviewIcon" />
          </div>
          <div className="six commondiv">
            {" "}
            <div>
              <h1 style={{color:"#199A8E"}}>{data?.report}</h1>
              <p>Reports</p>
            </div>
            <MdPayment className="overviewIcon" />
          </div>
        </div>
        {/* ************************************* */}
       
      </div>
    </div>
  );
};

export default FrontPage;
