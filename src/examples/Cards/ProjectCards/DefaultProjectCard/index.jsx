import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDAvatar from "../../../../components/MDAvatar";
import { useEffect, useState } from "react";
import { getUserById } from "../../../../services/user";

function DefaultProjectCard({ rec, image, label, title, description, action, action1, authors }) {
  const renderAuthors = authors.map(({ image: media, name }) => (
    <Tooltip key={name} title={name} placement="bottom">
      <MDAvatar
        src={media}
        alt={name}
        size="xs"
        sx={({ borders: { borderWidth }, palette: { white } }) => ({
          border: `${borderWidth[2]} solid ${white.main}`,
          cursor: "pointer",
          position: "relative",
          ml: -1.25,

          "&:hover, &:focus": {
            zIndex: "10",
          },
        })}
      />
    </Tooltip>
  ));
  const [teacher, setTeacher] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (rec) {
          const response = await getUserById(rec.teacher);
          setTeacher(response)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  })

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
        <CardMedia
          src={image}
          component="img"
          title={title}
          sx={{
            maxWidth: "100%",
            margin: 0,
            boxShadow: ({ boxShadows: { md } }) => md,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </MDBox>
      <MDBox mt={1} mx={0.5}>
        <MDTypography variant="button" fontWeight="regular" color="text" textTransform="capitalize">
          {label}
        </MDTypography>
        <MDBox mb={1}>
          {action.type === "internal" ? (
            <MDTypography
              component={Link}
              to={action.route}
              variant="h5"
              textTransform="capitalize"
            >
              {title}
            </MDTypography>
          ) : (
            <MDTypography
              component="a"
              href={action.route}
              target="_blank"
              rel="noreferrer"
              variant="h5"
              textTransform="capitalize"
            >
              {title}
            </MDTypography>
          )}
        </MDBox>
        <MDBox mb={3} lineHeight={0}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {description} {teacher.firstName} {teacher.lastName}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          {(action.type === "internal") && rec && !rec.isApplied && !rec.isRejected ?
            <>
              {action.onClick ?
                <MDButton
                  onClick={() => action.onClick(rec._id)}
                  variant="outlined"
                  size="small"
                  color={action.color}
                >
                  {action.label}
                </MDButton>
                : <MDButton
                  component={Link}
                  to={action.route}
                  variant="outlined"
                  size="small"
                  color={action.color}
                >
                  {action.label}
                </MDButton>}
              {action1 && <MDButton
                onClick={() => action1.onClick(rec._id)}
                variant="outlined"
                size="small"
                color={action1.color}
              >
                {action1.label}
              </MDButton>}
            </>
            : rec && rec.isApplied ?
              <MDButton
                variant="outlined"
                size="small"
                color="success"
                disabled={true}
              >
                Already applied
              </MDButton> :
              rec && rec.isRejected ?
                <MDButton
                  variant="outlined"
                  size="small"
                  color="error"
                  disabled={true}
                >
                  Rejected
                </MDButton> : null
          }
          <MDBox display="flex">{renderAuthors}</MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of DefaultProjectCard
DefaultProjectCard.defaultProps = {
  authors: [],
};

// Typechecking props for the DefaultProjectCard
DefaultProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]),
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "white",
    ]).isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
};

export default DefaultProjectCard;
