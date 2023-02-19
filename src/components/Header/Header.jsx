import React from "react";
import "./Header.css";
import { Heading } from "@chakra-ui/react";
function Header() {
  return (
    <div id="header-container">
      <div id="header">
        <Heading marginBottom={"24.69px"}>
          <strong style={{ fontWeight: 800 }}>Merlin</strong>
        </Heading>

        <div id="description">
          <p style={{ marginBottom: "10px" }}>
            Unleash the power of creativity with Merlin, the ultimate tool for
            marketers!
          </p>
          <p>Say goodbye</p>
        </div>
      </div>
    </div>
  );
}

export default Header;
