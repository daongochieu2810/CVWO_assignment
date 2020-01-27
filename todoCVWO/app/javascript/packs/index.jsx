import React from "react";
import { render } from "react-dom";
import $ from 'jquery';
import Popper from 'popper.js';
import App from "../components/App";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'

document.addEventListener("DOMContentLoaded", () => {
  render(
    <App />,
    document.body.appendChild(document.createElement("div"))
  );
});