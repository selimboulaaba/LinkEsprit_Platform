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

import { useState, useEffect, useMemo } from "react";
import './index.css';
// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Icon } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from "./components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";

// Material Dashboard 2 React themes
import theme from "./assets/theme";
import themeRTL from "./assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "./assets/theme-dark";
import themeDarkRTL from "./assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "./routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "./context";

// Images
import brandWhite from "./assets/images/logoEsprit.png";
import brandDark from "./assets/images/logoEsprit.png";
import Users from "./pages/user/users";
import AdminCreation from "./pages/user/adminCreation";

import Cover from "./layouts/authentication/reset-password/cover/index";
import Reset from "./layouts/authentication/reset-password/cover/reset";
import { AuthContextProvider } from "./context/userContext";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import { RequireAuth } from "./components/auth";
import UpdateProfile from "./layouts/profile/updateProfile";
import FeedPage from "./pages/feed/feedPage";
import CreateOfferView from "./pages/offer/createOfferView";
import Profile from "./layouts/profile";
import OfferDetailsView from "./pages/offer/offerDetailsView";
import io from "socket.io-client";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import Chatroompage from "./pages/chatroom/chatroompage";
import DashChat from "./pages/chatroom/dashChat";
import UpdateQuiz from "./pages/quiz/UpdateQuiz";
import Test from "./pages/quiz/Test";
import AdminQuiz from "./pages/quiz/AdminQuiz";


export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Add a new object to the routes array
  const newRoutes = [
    {
      route: "/updateProfile",
      key: "updateProfile",
      component: <UpdateProfile />
    },
    {
      route: "/offers/create",
      key: "/offers/create",
      component: <CreateOfferView />
    },
    {
      route: "/offers/:id",
      key: "OfferDetails",
      component: <OfferDetailsView/>
    },
    {
      route: "/profile/:id",
      key: "anotherProfile",
      component: <Profile />
    },
    {
    
    route:"/chatroom/:id",
    key:"chatroom",
    component:<Chatroompage  />
    },
    {
      
    route:"/dashchat",
    key:"dashchat",
    component:<DashChat  />
    }
    ,
    {
      
    route:"/updatequiz/:id",
    key:"quiz",
    component:<UpdateQuiz  />
    },
    {
      route: "/myquiz",
      component: <AdminQuiz />,
    
    },
    {
      
      key: "My test",
      
      route: "/test/:id/:res",
      component: <Test />,
      
    },
  ];

  const allRoutes = [...routes, ...newRoutes];



  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.route.includes("/authentication")) {
        return null;
      }

      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">settings</Icon>
    </MDBox>
  );


  //io socket
 

  const routing = () => {
    return (
      <Routes>
        <Route element={<RequireAuth auth={false} />}>
          <Route path="/authentication/sign-up" element={<SignUp />} />
          <Route path="/authentication/sign-in" element={<SignIn />}  />
          <Route path= "/passwordReset" element= {<Reset />}/>
          <Route path= "/requestReset" element= {<Cover />}/>
          
        </Route>
        <Route element={<RequireAuth auth={true}  />}>
          {getRoutes(allRoutes)} 
        </Route>
        <Route path="*" element={<Navigate to="/feed" />} />
      </Routes>
    )
  }

  return direction === "rtl" ? (
    <AuthContextProvider>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName=""
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}
          {layout === "vr" && <Configurator />}
          {routing()}
        </ThemeProvider>
      </CacheProvider>
    </AuthContextProvider>
  ) : (
    <AuthContextProvider>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName=""
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        {routing()}
      </ThemeProvider>
    </AuthContextProvider>
  );

}
