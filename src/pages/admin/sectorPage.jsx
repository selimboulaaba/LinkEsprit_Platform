import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import Footer from "../../examples/Footer";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import DataTable from '../../examples/Tables/DataTable';
import { Box } from "@mui/material";

import { Bounce, ToastContainer, toast } from "react-toastify";
import {
  createSector,
  getSector,
  deleteSector,
  updateSector,
} from "../../services/sector";
import "react-toastify/dist/ReactToastify.css";

function SectorPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sectors, setSectors] = useState([]);
  const containerRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        // If editing, update the sector
        await updateSector(editId, { name, description });
        const updatedSectors = sectors.map((sector) =>
          sector._id === editId
            ? { ...sector, name: editName, description: editDescription }
            : sector
        );
        setSectors(updatedSectors);
        toast.success("Sector updated successfully!");
      } else {
        // If not editing, create a new sector
        const createdSector = await createSector({ name, description });
        setSectors((prevSectors) => [...prevSectors, createdSector]);
        toast.success("Sector created successfully!");
      }
      setName("");
      setDescription("");
      setIsEditing(false); // Reset editing mode after submission
      fetchSectors(); // Refetch sectors to update the table
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (sectorId) => {
    try {
      await deleteSector(sectorId);
      setSectors((prevSectors) =>
        prevSectors.filter((sector) => sector._id !== sectorId)
      );
      toast.success("Sector deleted successfully!");
    } catch (error) {
      console.error("Error deleting sector:", error);
      toast.error("Failed to delete sector. Please try again.");
    }
  };

  const fetchSectors = () => {
    getSector()
      .then((response) => {
        if (response && response.sectors) {
          setSectors(response.sectors);
        } else {
          toast.error("Invalid response format. Please try again later.");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch sectors. Please try again later.");
      });
  };

  const handleEdit = (sectorId) => {
    const sectorToEdit = sectors.find((sector) => sector._id === sectorId);
    if (sectorToEdit) {
      setIsEditing(true);
      setEditId(sectorToEdit._id);
      setEditName(sectorToEdit.name);
      setEditDescription(sectorToEdit.description);
      setName(sectorToEdit.name);
      setDescription(sectorToEdit.description);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid justifyContent="center">
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item xs={8} >
              <Card className="container flex row">
                <Grid container alignItems="center">
                  <Grid container alignItems="center">
                    <Grid item p={2} xs>
                      <MDInput
                        multiline
                        rows={1}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        placeholder="Sector Name"
                      />
                      <MDInput
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        placeholder="Sector Description"
                        style={{ marginTop: "16px" }}
                      />
                    </Grid>
                  </Grid>
                  <hr />
                  <Grid pb={6} container alignItems="center">
                    <Grid item xs={12} ml={2}>
                      <MDButton
                        onClick={handleSubmit}
                        color="info"
                        disabled={!name || !description || isLoading}
                        className="create-button" // Apply class for styling
                      >
                        {isLoading ? "Creating..." : isEditing ? "Update Sector" : "Create Sector"}
                      </MDButton>

                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box pt={3}>
        <DataTable
          entriesPerPage={true}
          showTotalEntries={false}
          noEndBorder
          canSearch={true}
          table={{
            columns: [
             
              { Header: "Name", accessor: "name" },
              { Header: "Description", accessor: "description", width: "20%" },
              {
                Header: "Edit",
                accessor: "edit",
                width: "10%",
                align: "center",
                Cell: ({ row }) => (
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="small"
                    onClick={() => handleEdit(row.original._id)}
                  >
                    Edit
                  </MDButton>
                )
              },
              {
                Header: "Delete",
                accessor: "delete",
                width: "10%",
                align: "center",
                Cell: ({ row }) => (
                  <MDButton
                    variant="gradient"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row.original._id)}
                  >
                    Delete
                  </MDButton>
                )
              },
            ],
            rows: sectors
          }}
          pagination={{ variant: "gradient", color: "info" }}
        />
      </Box>

      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}

export default SectorPage;
