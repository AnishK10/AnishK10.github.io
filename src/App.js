import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import HomePage from "./Homepage";
import LoginPage from "./Login";
import { getAuth } from "firebase/auth";
import { db } from "./firebase";
import firebase from "./firebase";
import PatientsForm from "./PatientsForm";
import { Spin } from "antd";

export default function App({ firebaseApp }) {
  const auth = getAuth(firebaseApp);
  const [user, loading, error] = useAuthState(auth);

  // const [isLogin, setIsLogin] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);
  // const [user, setUser] = React.useState(null);

  // useEffect(() => {
  // console.log(user, loading, error);
  // }, [user, loading, error]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage firebaseApp={firebaseApp} />} />

      <Route
        path="*"
        element={
          loading ? (
            <Spin
              style={{ position: "absolute", left: "50%", top: "20%" }}
              size="large"
            />
          ) : user ? (
            <Outlet />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        {/* <Route path="abc" element={<h1>/abc Page</h1>} /> */}
        <Route path="form" element={<PatientsForm />} />
        <Route path="" element={<HomePage user={user} />} />
      </Route>
    </Routes>
  );
}
