import { useState } from "react";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import { Route, Routes } from "react-router-dom";
import FormAddUser from "./components/FormAddUser";
import FormEditUser from "./components/FormEditUser";

function App() {
  return (
    <>
      <div className="p-3">
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/form-add" element={<FormAddUser />} />
          <Route path="/form-edit/:id" element={<FormEditUser />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
