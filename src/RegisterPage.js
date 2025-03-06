import React, { useState } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    section: "",
    college: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Convert data to Excel format
    const ws = XLSX.utils.json_to_sheet([formData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // Create Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Event_Registrations.xlsx");

    alert("Registration successful! Your details are saved.");
    setFormData({ name: "", email: "", phone: "", department: "", section: "", college: "" });
  };

  return (
    <motion.div 
      className="register-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1 className="register-title">Event Registration</h1>
      <motion.form 
        className="register-form"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleRegister}
      >
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <input type="text" name="section" placeholder="Section" value={formData.section} onChange={handleChange} required />
        <input type="text" name="college" placeholder="College" value={formData.college} onChange={handleChange} required />
        <motion.button 
          type="submit"
          className="register-btn"
          whileHover={{ scale: 1.1 }}
        >
          Register Now
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default RegisterPage;
