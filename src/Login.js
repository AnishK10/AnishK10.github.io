import React from "react";
import { getAuth } from "firebase/auth";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { Button } from "antd";

export default function LoginPage({ firebaseApp }) {
  const auth = getAuth(firebaseApp);
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    window.location.href = "/#/";
    // return (
    //     <div>
    //         <p>Signed In User: {user.user.email}</p>
    //     </div>
    // );
  }
  return (
    <div style={{ position: "absolute", left: "48%", top: "10%" }}>
      <span>
        <Button type="primary" onClick={() => signInWithGoogle()}>
          Sign In
        </Button>
      </span>
    </div>
  );
}
