import React from "react";
import { useNavigate } from "react-router-dom";
import "./SupportUs.css";

function SupportUs() {
  const navigate = useNavigate();

  return (
    <div className="supportus-container">
      <img
        className="thankyou-logo"
        src="/homepage_image/thankyou.png"
        alt="Thank You Logo"
      />

      {/* Container to align names list and QR code side by side */}
      <div className="names-qr-container">
        <div className="names-list">
          <p>6538031521 Chonnipa Yongyai</p>
          <p>6538062021 Tanatorn Cheowtirakul</p>
          <p>6538095721 Noppawit Pongkijworasin</p>
          <p>6538101821 Nithiwat Niramitranon</p>
          <p>6538103021 Neeranan Chaisuwan</p>
          <p>6538110421 Prarn Panvongphaiboon</p>
          <p>6538140221 Phakapol Jantararuangtong</p>
        </div>
        <img className="qr" src="/homepage_image/qr.JPG" alt="QR Code" />
      </div>

      <div className="menu">
        <img
          src="/MainMenu.png"
          alt="Menu"
          className="menu-button"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

export default SupportUs;
