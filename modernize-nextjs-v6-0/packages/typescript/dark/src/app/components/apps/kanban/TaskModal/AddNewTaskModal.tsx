"use client";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TaskProperties } from "@/app/api/kanban/KanbanData";
import {
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";

function AddNewList({
  show,
  onHide,
  onSave,
  newTaskData,
  setNewTaskData,
  updateTasks,
}: any) {
  const { task, taskText, taskProperty, date, taskImage } = newTaskData;

  // Set default date to today if no date is provided
  const defaultDate = date || new Date();

  const handleDateChange = (newDate: any) => {
    setNewTaskData({ ...newTaskData, date: newDate });
  };

  // Function to handle saving changes and updating tasks
  const handleSave = () => {
    const updatedDate = date || new Date();
    // Update the task data with the default date if needed
    setNewTaskData({ ...newTaskData, date: updatedDate });
    onSave();
    updateTasks();
  };

  const isFormValid = () => {
    return task && taskText && taskProperty && date && taskImage;
  };
  return (
    <Dialog
      open={show}
      onClose={onHide}
      PaperProps={{
        component: "form",
      }}
    >
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            {/* task title */}
            <CustomFormLabel
              sx={{
                mt: 0,
              }}
              htmlFor="task"
            >
              Task Title *
            </CustomFormLabel>
            <CustomTextField
              id="task"
              variant="outlined"
              fullWidth
              value={task}
              onChange={(e: { target: { value: any; }; }) =>
                setNewTaskData({ ...newTaskData, task: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* task text */}
            <CustomFormLabel
              htmlFor="taskText"
              sx={{
                mt: 0,
              }}
            >
              Text*
            </CustomFormLabel>
            <CustomTextField
              id="taskText"
              variant="outlined"
              fullWidth
              value={taskText}
              onChange={(e: { target: { value: any; }; }) =>
                setNewTaskData({ ...newTaskData, taskText: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            {/* task image */}
            <CustomFormLabel
              htmlFor="taskImage"
              sx={{
                mt: 0,
              }}
            >
              Image URL*
            </CustomFormLabel>
            <CustomTextField
              id="taskImage"
              variant="outlined"
              fullWidth
              value={taskImage}
              onChange={(e: { target: { value: any; }; }) =>
                setNewTaskData({ ...newTaskData, taskImage: e.target.value })
              }
            />
            {taskImage !== undefined && (
              <img
                width={200}
                height={200}
                src={taskImage}
                alt="Selected"
                style={{ marginTop: "8px" }}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* task image */}
            <CustomFormLabel
              htmlFor="taskProperty"
              sx={{
                mt: 0,
              }}
            >
              Task Property *
            </CustomFormLabel>
            <CustomSelect
              fullWidth
              id="taskProperty"
              variant="outlined"
              value={taskProperty}
              onChange={(e: { target: { value: any; }; }) =>
                setNewTaskData({ ...newTaskData, taskProperty: e.target.value })
              }
            >
              <MenuItem value="">Select Task Property</MenuItem>
              {TaskProperties.map((property) => (
                <MenuItem key={property} value={property}>
                  {property}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* dua date */}
            <CustomFormLabel
              sx={{
                mt: 0,
              }}
            >
              Due Date *
            </CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={date || defaultDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <CustomTextField {...params} fullWidth />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid()}
        >
          Add Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AddNewList;
