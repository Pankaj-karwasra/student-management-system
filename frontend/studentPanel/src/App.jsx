import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import Header from "./Layout/header";
import AddStudentPage from "./components/addStudent";
import StudentList from "./components/student";
import EditStudentPage from "./components/editStudent";
import ChangePassword from "./Auth/changePassword";
import CreateAccount from "./Auth/signup";
import Login from "./Auth/login";
import { setGlobalNavigator } from "./utilis/auth";


function AppContent() {
  const navigate = useNavigate(); 

  useEffect(() => {
    setGlobalNavigator(navigate);

    

  }, [navigate]);

  return (
    <> 
      <Header/>
      <Routes>
        
        <Route path="/signup" element={<CreateAccount/>}></Route>
        <Route path="/login" element={<Login/>}></Route>

       
        <Route path="/addStudent" element={<AddStudentPage/>}></Route>
        <Route path="/addList" element={<StudentList/>}></Route>
        <Route path="/editStudent/:id" element={<EditStudentPage />} />
        <Route path="/changePassword" element={<ChangePassword/>}></Route>

       
        <Route path="/" element={<StudentList />} />
      </Routes>
    </>
  );
}


function App() {
  return(
    <BrowserRouter>
      <AppContent /> 
    </BrowserRouter>
  );
}


export default App;