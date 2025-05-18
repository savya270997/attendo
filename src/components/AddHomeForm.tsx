import React, { useState } from "react";
import "./form.scss";

const AddHomeForm: React.FC<{ onSubmit: (homeName: string) => void }> = ({
  onSubmit,
}) => {
  const [homeName, setHomeName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeName.trim()) {
      onSubmit(homeName.trim());
      (window as any).toast("Home added successfully", "success");
      setHomeName("");
    } else {
      (window as any).toast("Home name required", "error");
    }
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h2>Add Home</h2>
      <div className="form-control">
        <label htmlFor="homeName">Home Name</label>
        <input
          type="text"
          id="homeName"
          value={homeName}
          onChange={(e) => setHomeName(e.target.value)}
          placeholder="Enter home name"
        />
      </div>
      <div className="form-actions">
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default AddHomeForm;
