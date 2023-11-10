import React, { Component } from "react";
import tutorialService from "../Services/tutorial.service";

export default class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.state = {
      id: null,
      title: "",
      description: "",
      published: false,
      saved: false,
    };
  }

  saveTutorial() {
    console.log("Save clicked");
    const { title, description } = this.state;

    const tutorialToSave = {
      id: null,
      title: title,
      description: description,
      published: false,
    };

    tutorialService
      .create(tutorialToSave)
      .then((newlyAddedTutorial) => {
        console.log(newlyAddedTutorial);
        this.props.history.push("/tutorials");
      })
      .catch((error) => {
        console.log("Error occurred: " + error);
      });
  }

  onChangeTitle(e) {
    console.log(e.target.value);
    this.setState({
      title: e.target.value,
    });
  }

  onChangeDescription(e) {
    console.log(e.target.value);
    this.setState({
      description: e.target.value,
    });
  }

  render() {
    return (
      <div className="submit-form">
        <div className="form-group">
          <label htmlFor="title">Title : </label>
          <input
            type="text"
            className="form-control"
            id="title"
            required
            onChange={this.onChangeTitle}
            value={this.state.title}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="description">Description : </label>
          <input
            type="text"
            className="form-control"
            id="description"
            onChange={this.onChangeDescription}
            value={this.state.description}
          />
        </div>
        <br />
        <button className="btn btn-primary" onClick={() => this.saveTutorial()}>
          Save
        </button>
      </div>
    );
  }
}
