"use client";
import React, { useContext, useState } from "react";
import { InvoiceContext } from "@/app/context/InvoiceContext/index";
import {
  Checkbox,
  Table,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Badge,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

function InvoiceList() {
  const { invoices, deleteInvoice } = useContext(InvoiceContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice: { billFrom: string; billTo: string; status: string }) => {
      return (
        (invoice.billFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.billTo.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeTab === "All" || invoice.status === activeTab)
      );
    }
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  // Calculate the counts for different statuses
  const Shipped = invoices.filter((t: { status: string }) => t.status === "Shipped").length;
  const Delivered = invoices.filter((t: { status: string }) => t.status === "Delivered").length;
  const Pending = invoices.filter((t: { status: string }) => t.status === "Pending").length;

  // Toggle all checkboxes
  const toggleSelectAll = () => {
    const selectAllValue = !selectAll;
    setSelectAll(selectAllValue);
    if (selectAllValue) {
      setSelectedProducts(invoices.map((invoice: { id: any }) => invoice.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Toggle individual product selection
  const toggleSelectProduct = (productId: any) => {
    const index = selectedProducts.indexOf(productId);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id: any) => id !== productId));
    }
  };

  // Handle opening delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Handle confirming deletion of selected products
  const handleConfirmDelete = async () => {
    for (const productId of selectedProducts) {
      await deleteInvoice(productId);
    }
    setSelectedProducts([]);
    setSelectAll(false);
    setOpenDeleteDialog(false);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", border: `2px solid `, padding: "1rem", borderRadius: "8px", width: "100%", maxWidth: "250px" }}>
          <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `2px solid` }}>
            <SearchIcon />
          </div>
          <div>
            <h5>Total</h5>
            <p>{invoices.length} invoices</p>
            <h6>$46,218.04</h6>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", border: `2px solid `, padding: "1rem", borderRadius: "8px", width: "100%", maxWidth: "250px" }}>
          <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `2px solid` }}>
            <VisibilityIcon />
          </div>
          <div>
            <h5>Shipped</h5>
            <p>{invoices.length} invoices</p>
            <h6>$23,110.23</h6>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", border: `2px solid `, padding: "1rem", borderRadius: "8px", width: "100%", maxWidth: "250px" }}>
          <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `2px solid` }}>
            <VisibilityIcon />
          </div>
          <div>
            <h5>Delivered</h5>
            <p>{invoices.length} invoices</p>
            <h6>$13,825.05</h6>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", border: `2px solid `, padding: "1rem", borderRadius: "8px", width: "100%", maxWidth: "250px" }}>
          <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `2px solid` }}>
            <SearchIcon />
          </div>
          <div>
            <h5>Pending</h5>
            <p>{invoices.length} invoices</p>
            <h6>$4,655.63</h6>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <TextField
          id="search"
          type="text"
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          InputProps={{ startAdornment: <SearchIcon /> }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" component={Link} href="/apps/invoice/create">
          New Invoice
        </Button>
      </div>
      <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="invoice status tabs">
          <Tab label={`All (${invoices.length})`} value="All" />
          <Tab label={`Shipped (${Shipped})`} value="Shipped" />
          <Tab label={`Delivered (${Delivered})`} value="Delivered" />
          <Tab label={`Pending (${Pending})`} value="Pending" />
        </Tabs>
        {selectAll && (
          <DeleteIcon onClick={handleDelete} />
        )}
      </div>
      <div style={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>BILL FROM</TableCell>
              <TableCell>BILL TO</TableCell>
              <TableCell>TOTAL COST</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell align="center">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice: { id: any; billFrom: any; billTo: any; totalCost: any; status: any }) => (
              <TableRow key={invoice.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(invoice.id)}
                    onChange={() => toggleSelectProduct(invoice.id)}
                  />
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.billFrom}</TableCell>
                <TableCell>{invoice.billTo}</TableCell>
                <TableCell>{invoice.totalCost}</TableCell>
                <TableCell>
                  <Badge color={invoice.status === "Shipped" ? "success" : invoice.status === "Delivered" ? "secondary" : "warning"}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Invoice">
                    <IconButton component={Link} href={`/apps/invoice/edit/${invoice.billFrom}`}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View Invoice">
                    <IconButton component={Link} href={`/apps/invoice/detail/${invoice.billFrom}`}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Invoice">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedProducts([invoice.id]);
                        handleDelete();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete selected invoices?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default InvoiceList;
