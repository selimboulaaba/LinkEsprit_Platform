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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import Billing from "./layouts/billing";

import Notifications from "./layouts/notifications";
import Profile from "./layouts/profile";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import Users from "./pages/user/users";
import AdminCreation from "./pages/user/adminCreation";
import FeedPage from "./pages/feed/feedPage";
import SectorPage from "./pages/admin/sectorPage";
import UserOffersList from "./pages/offer/offersListView/UserOffresList";
import AdminOffersList from "./pages/offer/offersListView/AdminOffersList";
import DashChat from "./pages/chatroom/dashChat";
import AdminQuiz from "./pages/quiz/AdminQuiz";
import Test from "./pages/quiz/Test";
import QuizListView from "./pages/quiz/QuizListView";
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ['ADMIN', 'SUPERADMIN']
  },
  {
    type: "collapse",
    name: "Feed",
    key: "feed",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/feed",
    component: <FeedPage />,
    roles: []
  },
  {
    type: "collapse",
    name: "Sector",
    key: "sector",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/sector",
    component: <SectorPage />,
    roles: ['ADMIN', 'SUPERADMIN']
  },
  // {
  //   type: "collapse",
  //   name: "Users",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Enterprises",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },

  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    roles: []
  },
  {
    type: "collapse",
    name: "dashchat",
    key: "dashchat",
    icon: <Icon fontSize="small">chat</Icon>,
    route: "/dashchat",
    component: <DashChat />,
    roles: []
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <Users />,
    roles: ['ADMIN', 'SUPERADMIN']
  },
  {
    type: "collapse",
    name: "Add Admin",
    key: "addAdmin",
    icon: <Icon fontSize="small">person_add</Icon>,
    route: "/addAdmin",
    component: <AdminCreation />,
    roles: ['SUPERADMIN']
  },
  {
    type: "collapse",
    name: "My Offers",
    key: "myOffers",
    icon: <Icon fontSize="small">work_history</Icon>,
    route: "/myOffers",
    component: <AdminOffersList />,
    roles: ['ADMIN', 'SUPERADMIN', 'TEACHER', 'ENTREPRISE']
  },
  {
    type: "collapse",
    name: "Offers",
    key: "Offers",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/offers",
    component: <UserOffersList />,
    roles: []
  },
 
  {
    type: "collapse",
    name: "Quiz",
    key: "Quiz",
    icon: <Icon fontSize="small">work_history</Icon>,
    route: "/allquizes",
    component: <QuizListView />,
    roles: ['ADMIN', 'SUPERADMIN', 'TEACHER', 'ENTREPRISE']
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/authentication/sign-in",
  //   component: <SignIn />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // }
];

export default routes;
