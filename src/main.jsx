/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 WebMasters (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'material-icons/iconfont/material-icons.css';

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
    <GoogleOAuthProvider clientId="226560607715-24do30sbarerplckf2t8v0cqkcja4uc1.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
