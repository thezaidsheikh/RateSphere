import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Test = () => {
  const [rating, setRating] = useState(0);
  return (
    <div>
      <StarRating maxRating={10} size={24} color="orange" onSetRating={setRating} />
      <p>Rating count: {rating}</p>
    </div>
  );
};
// StrictMode runs hooks twice for the development and test our hooks is running correct or not.
root.render(
  <React.StrictMode>
    <App />
    {/* <Test /> */}
    {/* <StarRating maxRating={10} size={24} color="orange" />
    <StarRating maxRating={3} size={24} color="orange" messages={["Terrible", "Good", "Amazing"]} /> */}
  </React.StrictMode>
);
