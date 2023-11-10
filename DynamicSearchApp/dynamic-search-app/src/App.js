import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import TutorialList from "./Components/tutorial-list.component";
import AddTutorial from "./Components/add-tutorial.component";
import Tutorial from "./Components/tutorial.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to="/tutorials" className="nav-link">
                      Tutorial List
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add" className="nav-link">
                      Add Tutorial
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="container mt-3">
            <Routes>
              <Route path="/" element={<TutorialList />} />
              <Route path="/tutorials" element={<TutorialList />} />
              <Route path="/add" element={<AddTutorial />} />
              <Route path="/tutorials/:id" element={<Tutorial />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

