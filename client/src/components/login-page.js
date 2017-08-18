import React from "react";
import "./login-page.css";
export default function LoginPage() {
  return (
    <div className="login">
      <h1>Omelette du Fromage!</h1>
      <p>
        Omelette du Fromage is a fun and easy to use app to help you learn the
        beautiful language of French. The app will show you words you struggle
        with more often, and track how often you get each word correct. I hope
        you're ready to learn, go have some fun!
      </p>

      <a href={"/api/auth/google"}>
        <button className="login-button">Login </button>
      </a>
    </div>
  );
}
