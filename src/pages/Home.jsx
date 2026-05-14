import React from "react";
import { useNavigate } from "react-router-dom";
// import { useGetProfile } from "../hooks/useRQauth";

const Home = () => {
  // useGetProfile();
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome Admin panel to the Home Page</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: 20,
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Home;
