import React from "react";
import "../Footer/Footer.css";

function Footer() {
  return (
    <footer className="bg-light fixed-bottom  ">
      <div className="footer">
        <a className="text-dark " href="">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a className="text-dark" href="">
          Terms of Use
        </a>{" "}
        | © 2023 Crystal Solution. All rights reserved.
      </div>
    </footer>

  );
}

export default Footer;
