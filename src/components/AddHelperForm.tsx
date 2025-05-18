import React, { useState } from "react";
import "./form.scss";

const AddHelperForm: React.FC<{
  onSubmit: (helperName: string, homeId: string) => void;
  homes: { id: string; name: string }[];
}> = ({ onSubmit, homes }) => {
  const [helperName, setHelperName] = useState("");
  const [selectedHome, setSelectedHome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (helperName && selectedHome) {
      onSubmit(helperName, selectedHome);
      (window as any).toast("Helper added successfully", "success");
      setHelperName("");
    } else {
      (window as any).toast("Please fill all fields", "error");
    }
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h2>Add Helper</h2>
      <div className="form-control">
        <label htmlFor="helperName">Helper Name</label>
        <input
          type="text"
          id="helperName"
          value={helperName}
          onChange={(e) => setHelperName(e.target.value)}
          placeholder="Enter helper name"
        />
      </div>

      <div className="form-control">
        <label htmlFor="homeSelect">Assign to Home</label>
        <select
          id="homeSelect"
          value={selectedHome}
          onChange={(e) => setSelectedHome(e.target.value)}
        >
          <option value="">Select Home</option>
          {homes.map((home) => (
            <option key={home.id} value={home.id}>
              {home.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default AddHelperForm;
