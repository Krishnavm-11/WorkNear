import { Navigate } from "react-router-dom";

function WorkerRoute({ children }) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {

    return <Navigate to="/login" />;

  }

  if (user.role !== "worker") {

    return <Navigate to="/" />;

  }

  return children;

}

export default WorkerRoute;