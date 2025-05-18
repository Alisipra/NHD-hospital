import { useState, useEffect } from "react";
import diagnosisCodes from "../Doctor/diagnosisCodes.json";

const DiagnosisInput = ({ ReportValue, HandleReportChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCodes, setFilteredCodes] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = diagnosisCodes.filter((code) =>
        code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCodes(filtered);
    } else {
      setFilteredCodes([]);
    }
  }, [searchTerm]);

  const handleSelectCode = (code) => {
    HandleReportChange({
      target: { name: "extrainfo", value: code },
    });
    setSearchTerm("");
    setFilteredCodes([]);
  };

  return (
    <div >
      <label style={{marginLeft:"-20px"}}>Extra Info (ICD-10)</label>
      <div className="inputdiv ">
        <input
          type="text"
          placeholder="Search Diagnosis"
          name="extrainfo"
          value={searchTerm || ReportValue.extrainfo}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{"margin-left":"120px",width:"auto"}}
        />
        {filteredCodes.length > 0 && (
          <ul className="dropdown">
            {filteredCodes.map((code, index) => (
              <li key={index} onClick={() => handleSelectCode(code)}>
                {code}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DiagnosisInput;
