import { Link } from "react-router-dom";
import './App.css';
import axios from "axios";
import { useEffect } from "react";
import CarCrashIcon from '@mui/icons-material/CarCrash';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';

export default function App() {

  useEffect(() => {
    axios.get("/reset_reserved")

  }, [])


  return (
    <div className="p-4">
      <div className="row">
        <div className="col-8">
          <h1 className="mb-4 text-dark">Welcome to Cipher</h1>
        </div>
        <div className="col">

          <a href="/logout">
            <button className="btn-danger p-2 fw-bold">
              <LogoutIcon />Log out
            </button>
          </a>
        </div>
      </div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <div className="row">
          <div className="col-2">
            <Link to="/invoice_validation_wrapper" className="no-style">
              <button className="btn-sixt p-3 fw-bold w-75">
                <h5>Validierung</h5>
                <VisibilityIcon fontSize="large" />
              </button>
            </Link>

          </div>
          <div className="col-2">
            <Link to="/owi_auskunft" className="no-style">
              <button className="btn-sixt p-3 fw-bold w-75">
                <h5>Fahrerauskunft</h5>
                <CarCrashIcon fontSize="large" />
              </button>
            </Link>

          </div>
        </div>
      </nav>
    </div>
  );
}