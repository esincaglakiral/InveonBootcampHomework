import React, { Component } from "react";
import tutorialService from "../Services/tutorial.service";
import { Link } from "react-router-dom";

export default class TutorialList extends Component {
  constructor(props) {
    super(props);
    this.tutorials = [];
    this.state = {
      filteredTutorials: [],
      currentIndex: -1,
      currentTutorial: null,
      searchValue: "",
    };
  }

  componentDidMount() {
    this.fetchTutorials();
  }

  fetchTutorials() {
    tutorialService
      .getAll()
      .then((tutorialList) => {
        console.log(tutorialList);
        this.setState({
          filteredTutorials: tutorialList.data,
        });
        this.tutorials = tutorialList.data;
      })
      .catch((error) => {
        console.log("An error occurred: " + error);
      });
  }

  setActiveTutorial(tutorial, index) {
    console.log("Here");
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index,
    });
  }

  onChangeCaptureHandler = (e) => {
    const filteredData = this.tutorials.filter((element) => {
      if (e.target.value === "") {
        return element;
      } else {
        return element.title
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      }
    });
    this.setState({ filteredTutorials: filteredData });
  };

  render() {
    const { filteredTutorials, currentTutorial, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-6">
          <h4>Tutorial List</h4>
          <ul className="list-group">
            <li>
              <div className="input-group">
                <input
                  onChangeCapture={(e) => this.onChangeCaptureHandler(e)}
                  type="text"
                  className="form-control"
                  aria-label=""
                />
                <span className="input-group-text">Search</span>
              </div>
              <br></br>
            </li>
            {filteredTutorials &&
              filteredTutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveTutorial(tutorial, index)}
                  key={index}
                >
                  {tutorial.title}
                </li>
              ))}
          </ul>
        </div>

        <div className="col-md-6">
          {currentTutorial ? (
            <div>
              <h4>Tutorial</h4>
              <div>
                <label>
                  <strong>Title : </strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div>
                <label>
                  <strong>Description : </strong>
                </label>{" "}
                {currentTutorial.description}
              </div>
              <div>
                <label>
                  <strong>Status : </strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Waiting..."}
              </div>
              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="btn btn-success"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
