import React from "react";

function SidebarMenu() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="bg-dark col-auto col-md-3 min-vh-100">
          {/* <a href="#home" className="text-decoration-none text-white d-flex align-itemcenter">
            <span className="ms-1 fs-4">Brand</span>
          </a> */}

          <ul className="nav nav-pills flex-column">        
            <li className="nav-item text-white fs-4">
              <a href="#" className="nav-link text-white fs-5">
                <i className="bi bi-house"></i>
                <span className="ms-2">출석</span>
              </a>
            </li>
            <li className="nav-item text-white fs-4">
              <a href="#" className="nav-link text-white fs-5">
                <i className="bi bi-house"></i>
                <span className="ms-2">회원</span>
              </a>
            </li>
            <li className="nav-item text-white fs-4">
              <a href="#" className="nav-link text-white fs-5">
                <i className="bi bi-table"></i>
                <span className="ms-2">조</span>
              </a>
            </li>
          </ul>

        </div>
      </div>
    </div>
  )
}

export default SidebarMenu;
