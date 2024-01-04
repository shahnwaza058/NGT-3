import React from "react";
import { IoIosSave } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";

const Header = () => {
  return (
    <div className="header-container h-100">
      <div className="w-100 bg-dark text-white p-2">
        <p className="text-center h1 m-0 fs-5 fw-bolder">NGT-PROJECT</p>
      </div>
      <div className="icons">
        <Button
          variant="danger"
          size="sm"
          className=" m-2 text-capitalize text-white"
        >
          <IoIosSave color="white" size={25} /> save
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="m-2 text-capitalize text-white"
        >
          <FaCloudDownloadAlt color="white" size={25} /> download
        </Button>
      </div>
    </div>
  );
};

export default Header;
