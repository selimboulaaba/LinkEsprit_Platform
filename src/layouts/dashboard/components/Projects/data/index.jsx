/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../../components/MDBox";
import MDTypography from "../../../../../components/MDTypography";
import MDAvatar from "../../../../../components/MDAvatar";
import MDProgress from "../../../../../components/MDProgress";

// Images
import logoXD from "../../../../../assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "../../../../../assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "../../../../../assets/images/small-logos/logo-slack.svg";
import logoSpotify from "../../../../../assets/images/small-logos/logo-spotify.svg";
import logoJira from "../../../../../assets/images/small-logos/logo-jira.svg";
import logoInvesion from "../../../../../assets/images/small-logos/logo-invision.svg";
import team1 from "../../../../../assets/images/team-1.jpg";
import team2 from "../../../../../assets/images/team-2.jpg";
import team3 from "../../../../../assets/images/team-3.jpg";
import team4 from "../../../../../assets/images/team-4.jpg";
import { useEffect, useState } from "react";

export default function data(dashboard) {
  console.log("skouza", dashboard)
  const [table, setTable] = useState([])

  useEffect(() => {
    const entreprises = dashboard.entreprises
    dashboard.entreprises.map(entreprise => {
      let acceptedUsers = []
      dashboard.applications.map(application => {
        if (application.offerId.publication.userId._id === entreprise._id) {
          acceptedUsers.push(application.userId)
        }
      });
      entreprise.acceptedUsers = acceptedUsers

      let offers = 0;
      dashboard.offers.map(offer => {
        if (offer.publication.userId._id === entreprise._id) {
          offers++;
        }
      })
      entreprise.offers = offers

      const currentDate = new Date();
      const currentMonthStart = new Date(currentDate);
      currentMonthStart.setDate(currentDate.getDate() - 30);
      const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const maxPublicationsByMonth = dashboard.publications.reduce((acc, publication) => {
        if (publication.userId === entreprise._id) {
          const monthYear = new Date(publication.publicationDate).toLocaleString('default', { year: 'numeric', month: 'long' });
          acc[monthYear] = (acc[monthYear] || 0) + 1;
        }
        return acc;
      }, {});
      let maxCount = 0;
      for (const monthYear in maxPublicationsByMonth) {
        if (maxPublicationsByMonth[monthYear] > maxCount) {
          maxCount = maxPublicationsByMonth[monthYear];
        }
      }
      const publicationsInCurrentMonth = dashboard.publications.filter(publication => {
        if (publication.userId === entreprise._id) {
          const publicationDate = new Date(publication.publicationDate);
          return publicationDate >= currentMonthStart && publicationDate <= currentMonthEnd;
        }
      }).length;
      entreprise.averagePublication = publicationsInCurrentMonth / maxCount
    })
    setTable(entreprises)
  }, [dashboard])



  const avatars = (members) =>
    members.map((user) => (
      <Tooltip key={user._id} title={user.email} placeholder="bottom">
        <MDAvatar
          src={user.image}
          alt="name"
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",

            "&:not(:first-of-type)": {
              ml: -1.25,
            },

            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));

  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const rows = () => {
    const generatedRows = [];
    table.forEach(user => {
      generatedRows.push({
        companies: <Company image={user.image} name={user.role === "ENTREPRISE" ? user.enterpriseName : user.lastName + " " + user.firstName} />,
        members: (
          <MDBox display="flex" py={1}>
            {avatars(user.acceptedUsers)}
          </MDBox>
        ),
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {user.offers}
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={(user.averagePublication)*100} color={user.averagePublication < 0.7 ? "info" : "success"} variant="gradient" label={false} />
          </MDBox>
        ),
      });
    })
    return generatedRows;
  }

  return {
    columns: [
      { Header: "companies", accessor: "companies", width: "40%", align: "left" },
      { Header: "accepted users", accessor: "members", width: "15%", align: "left" },
      { Header: "nb of offers", accessor: "budget", align: "center" },
      { Header: "average usage this month", accessor: "completion", align: "center" },
    ],

    rows: rows()
    //  [
    // {
    //   companies: <Company image={logoXD} name="Material UI XD Version" />,
    //   members: (
    //     <MDBox display="flex" py={1}>
    //       {avatars([
    //         [team1, "Ryan Tompson"],
    //         [team2, "Romina Hadid"],
    //         [team3, "Alexander Smith"],
    //         [team4, "Jessica Doe"],
    //       ])}
    //     </MDBox>
    //   ),
    //   budget: (
    //     <MDTypography variant="caption" color="text" fontWeight="medium">
    //       $14,000
    //     </MDTypography>
    //   ),
    //   completion: (
    //     <MDBox width="8rem" textAlign="left">
    //       <MDProgress value={60} color="info" variant="gradient" label={false} />
    //     </MDBox>
    //   ),
    // },
    // {
    //   companies: <Company image={logoAtlassian} name="Add Progress Track" />,
    //   members: (
    //     <MDBox display="flex" py={1}>
    //       {avatars([
    //         [team2, "Romina Hadid"],
    //         [team4, "Jessica Doe"],
    //       ])}
    //     </MDBox>
    //   ),
    //   budget: (
    //     <MDTypography variant="caption" color="text" fontWeight="medium">
    //       $3,000
    //     </MDTypography>
    //   ),
    //   completion: (
    //     <MDBox width="8rem" textAlign="left">
    //       <MDProgress value={10} color="info" variant="gradient" label={false} />
    //     </MDBox>
    //   ),
    // },
    // {
    //   companies: <Company image={logoSlack} name="Fix Platform Errors" />,
    //   members: (
    //     <MDBox display="flex" py={1}>
    //       {avatars([
    //         [team1, "Ryan Tompson"],
    //         [team3, "Alexander Smith"],
    //       ])}
    //     </MDBox>
    //   ),
    //   budget: (
    //     <MDTypography variant="caption" color="text" fontWeight="medium">
    //       Not set
    //     </MDTypography>
    //   ),
    //   completion: (
    //     <MDBox width="8rem" textAlign="left">
    //       <MDProgress value={100} color="success" variant="gradient" label={false} />
    //     </MDBox>
    //   ),
    // },
    // {
    //   companies: <Company image={logoSpotify} name="Launch our Mobile App" />,
    //   members: (
    //     <MDBox display="flex" py={1}>
    //       {avatars([
    //         [team4, "Jessica Doe"],
    //         [team3, "Alexander Smith"],
    //         [team2, "Romina Hadid"],
    //         [team1, "Ryan Tompson"],
    //       ])}
    //     </MDBox>
    //   ),
    //   budget: (
    //     <MDTypography variant="caption" color="text" fontWeight="medium">
    //       $20,500
    //     </MDTypography>
    //   ),
    //   completion: (
    //     <MDBox width="8rem" textAlign="left">
    //       <MDProgress value={100} color="success" variant="gradient" label={false} />
    //     </MDBox>
    //   ),
    // },
    // {
    //   companies: <Company image={logoJira} name="Add the New Pricing Page" />,
    //   members: (
    //     <MDBox display="flex" py={1}>
    //       {avatars([[team4, "Jessica Doe"]])}
    //     </MDBox>
    //   ),
    //   budget: (
    //     <MDTypography variant="caption" color="text" fontWeight="medium">
    //       $500
    //     </MDTypography>
    //   ),
    //   completion: (
    //     <MDBox width="8rem" textAlign="left">
    //       <MDProgress value={25} color="info" variant="gradient" label={false} />
    //     </MDBox>
    //   ),
    // },
    // {
    //   companies: <Company image={logoInvesion} name="Redesign New Online Shop" />,
    //   members: (
    //     <MDBox display="flex" py={1}>
    //       {avatars([
    //         [team1, "Ryan Tompson"],
    //         [team4, "Jessica Doe"],
    //       ])}
    //     </MDBox>
    //   ),
    //   budget: (
    //     <MDTypography variant="caption" color="text" fontWeight="medium">
    //       $2,000
    //     </MDTypography>
    //   ),
    //   completion: (
    //     <MDBox width="8rem" textAlign="left">
    //       <MDProgress value={40} color="info" variant="gradient" label={false} />
    //     </MDBox>
    //   ),
    // },
    // ],
  };
}
