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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ReportsBarChart from "../../examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "../../examples/Charts/LineCharts/ReportsLineChart";
import HorizontalBarChart from "../../examples/Charts/BarCharts/HorizontalBarChart";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DefaultInfoCard from "../../examples/Cards/InfoCards/DefaultInfoCard";
import PieChart from "../../examples/Charts/PieChart";
// Data
import reportsBarChartData from "../../layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "../../layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "../../layouts/dashboard/components/Projects";
import OrdersOverview from "../../layouts/dashboard/components/OrdersOverview";
import { getDashboard } from "../../services/user";
import { useEffect, useState } from "react";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [dashboard, setDashboard] = useState({
    countOffersBySector: {
      counts: [],
      sectors: []
    },
    averageQuizScore: {
      averageScore: [],
      name: []
    },
    entreprises: [
      {
        acceptedUsers: []
      }
    ],
    applications: [],
    offers: [],
    publications: []
  })

  const fetchDashboard = async () => {
    
    try {
      const response = await getDashboard();
      const offerCounts = [];
      const sectors = [];
      const averageScore = [];
      const quizName = []

      response.result.countOffersBySectors.forEach(item => {
        offerCounts.push(item.count);
        sectors.push(item.sector);
      });
      response.result.averageQuizScores.forEach(item => {
        averageScore.push(item.averageScore / item.questions.length);
        quizName.push(item.name);
      });
      response.result.countOffersBySector = {
        counts: offerCounts,
        sectors: sectors
      }
      response.result.averageQuizScore = {
        averageScore: averageScore,
        name: quizName
      }
      setDashboard(response.result)
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, [])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <DefaultInfoCard
                color="dark"
                icon="work"
                title="Offers"
                value={dashboard.nbOffers}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <DefaultInfoCard
                color="error"
                icon="apartment"
                title="Entreprises"
                value={dashboard.nbEntreprises}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <DefaultInfoCard
                color="dark"
                icon="person"
                title="Students & Alumnies"
                value={dashboard.nbStudents + dashboard.nbAlumnis}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <DefaultInfoCard
                color="error"
                icon="school"
                title="Tests"
                value={dashboard.nbQuizzs}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
          <Grid item xs={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="success"
                  title="Offers Count by Sector "
                  date="just updated"
                  chart={{
                    labels: dashboard.countOffersBySector.sectors,
                    datasets: {
                      label: "Offers",
                      data: dashboard.countOffersBySector.counts
                    }
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Average Test Score by Quiz"
                  date="just updated"
                  chart={{
                    labels: dashboard.averageQuizScore.name,
                    datasets: {
                      label: "Average",
                      data: dashboard.averageQuizScore.averageScore
                    }
                  }}
                />
              </MDBox>
            </Grid>
            {/* <Grid item xs={6}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info" }}
                  title="Offers Count by Sector"
                  chart={{
                    labels: dashboard.countOffersBySector.sectors,
                    datasets: {
                      label: "Offers",
                      backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                      data: dashboard.countOffersBySector.counts
                    },
                  }}
                />
              </MDBox>
            </Grid> */}
            
            {/* <Grid item xs={6}>
              <MDBox mb={3}>
                <PieChart
                  icon={{ color: "info" }}
                  title="Average Test Score by Quiz"
                  chart={{
                    labels: dashboard.averageQuizScore.name,
                    datasets: {
                      label: "Average",
                      backgroundColors: ["info", "primary", "dark", "secondary", "primary"],
                      data: dashboard.averageQuizScore.averageScore
                    },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid> */}
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Projects dashboard={dashboard} />
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid> */}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
