import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

// protected Authentication :-
import { useUser } from "./context/UserContext";

function PrivateRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  // socket.on("messsage", (msg) => console.log("socket connected"));
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
