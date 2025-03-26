import React from "react";

export default function Navbar() {
  return (
    <>
      <div class="navStick">
        <div class="Toastify"></div>
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">
              <img
                src="data:image/png;base64,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"
                title="logo"
                alt="img"
              />
            </a>
            <button
              aria-controls="basic-navbar-nav"
              type="button"
              aria-label="Toggle navigation"
              class="navbar-toggler collapsed"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse collapse" id="basic-navbar-nav">
              <div class="me-auto navbar-nav">
                <a class="nav-link" href="/ourteam">
                  Doctors
                </a>
                <div class="nav-item dropdown">
                  <a
                    id="basic-nav-dropdown"
                    aria-expanded="false"
                    role="button"
                    class="dropdown-toggle nav-link"
                    tabindex="0"
                    href="#"
                  >
                    About us
                  </a>
                </div>
                <a class="nav-link" href="/booking">
                  Booking
                </a>
                <div class="nav-item dropdown">
                  <a
                    id="basic-nav-dropdown"
                    aria-expanded="false"
                    role="button"
                    class="dropdown-toggle nav-link"
                    tabindex="0"
                    href="#"
                  >
                    Login
                  </a>
                </div>
                <a class="nav-link" href="/Report">
                  <button type="button">
                    Report
                    <span>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path>
                      </svg>
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
