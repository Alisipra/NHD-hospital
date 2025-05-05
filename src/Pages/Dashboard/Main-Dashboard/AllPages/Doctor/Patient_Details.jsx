import React, { useEffect, useState } from "react";
import { Table, message, Input } from "antd";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Sidebar from "../../GlobalFiles/Sidebar";
import Topbar from "../../GlobalFiles/Topbar";


const { Search } = Input;
const url="https://nhd-server.vercel.app"
const Patient_Details = () => {
  const { data } = useSelector((store) => store.auth);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${url}/patients/`);
        const result = await response.json();

        if (response.ok) {
          setPatients(result.patients);
          setFilteredPatients(result.patients);
        } else {
          message.error(result.error || "Failed to fetch patients.");
        }
      } catch (error) {
        message.error("Error fetching patients. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (!data?.isAuthenticated) {
    return <Navigate to="/" />;
  }
  if (data?.user?.userType !== "doctor") {
    return <Navigate to="/dashboard" />;
  }

  const columns = [
    { title: "ID", dataIndex: "patientID", key: "patientID" },
    { title: "Name", dataIndex: "patientName", key: "patientName" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Blood Group", dataIndex: "bloodGroup", key: "bloodGroup" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  const onSearch = (value) => {
    if (!value) {
      setFilteredPatients(patients);
    } else {
      const filteredData = patients.filter((patient) =>
        patient.patientID.toString().includes(value)
      );
      setFilteredPatients(filteredData);
    }
  };

  return (
    <div className="container-fluid d-flex p-0">
      <Sidebar />
      <div className="AfterSideBar flex-grow-1 p-3">
        <Topbar />
        <div className="Patient_Page">
          <h1 className="text-center mb-4">Patient Details</h1>

          <div className="d-flex justify-content-center mb-3">
            <Search
              placeholder="Search by Patient ID"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
              className="w-100 w-md-50"
            />
          </div>

          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={filteredPatients}
              loading={loading}
              pagination={{ pageSize: 5 }}
              rowKey="patientID"
              className="table table-striped table-bordered"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient_Details;
