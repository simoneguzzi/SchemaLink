import React, {Component} from 'react';
import config from "../config";

export class GoogleDriveIntegration extends Component {
  componentDidMount() {
    window.gapi.load("client:auth2", this.initClient);
  }

  render() {
    return null
  }
}