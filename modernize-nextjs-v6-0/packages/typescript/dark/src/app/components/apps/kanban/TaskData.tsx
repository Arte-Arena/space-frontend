"use client";
import { useContext, useState } from "react";
import {
  IconPencil,
  IconDotsVertical,
  IconTrash,
  IconCalendar,
} from "@tabler/icons-react";
import EditTaskModal from "./TaskModal/EditTaskModal";
import { KanbanDataContext } from "@/app/context/kanbancontext/index";
import { Draggable } from "react-beautiful-dnd";
import axios from "@/utils/axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Box,
  Card,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import BlankCard from "../../shared/BlankCard";
interface TaskDataProps {
  task: { id: any };
  onDeleteTask: () => void;
  index: number;
}
const TaskData: React.FC<TaskDataProps> = ({
  task,
  onDeleteTask,
  index,
}: any) => {
  const { setError } = useContext(KanbanDataContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleShowEditModal = () => {
    handleClose();
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => onDeleteTask(task.id);

  const handleSaveEditedTask = async (editedTaskData: { id: any }) => {
    try {
      const response = await axios.put("/api/TodoData/editTask", {
        taskId: editedTaskData.id,
        newData: editedTaskData,
      });
      if (response.status === 200) {
        setEditedTask(editedTaskData);
      } else {
        throw new Error("Failed to edit task");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const formatDate = (selectedDate: string | number | Date) => {
    const dateObj = new Date(selectedDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    return `${day} ${month}`;
  };

  const backgroundColor =
    editedTask.taskProperty === "Design"
      ? "success.main"
      : editedTask.taskProperty === "Development"
        ? "warning.main"
        : editedTask.taskProperty === "Mobile"
          ? "primary.main"
          : editedTask.taskProperty === "UX Stage"
            ? "warning.main"
            : editedTask.taskProperty === "Research"
              ? "secondary.main"
              : editedTask.taskProperty === "Data Science"
                ? "error.main"
                : editedTask.taskProperty === "Branding"
                  ? "success.main"
                  : "primary.contrastText";

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Box
          mb={3}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <BlankCard>
            <Box
              px={2}
              py={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize="14px" variant="h6">
                {editedTask.task}
              </Typography>
              <Box>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}

                >
                  <IconDotsVertical size="1rem" />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleShowEditModal}>
                    <ListItemIcon>
                      <IconPencil size="1.2rem" />
                    </ListItemIcon>
                    <ListItemText> Edit</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                      <IconTrash size="1.2rem" />{" "}
                    </ListItemIcon>
                    <ListItemText> Delete</ListItemText>
                  </MenuItem>
                </Menu>
                <EditTaskModal
                  show={showEditModal}
                  onHide={handleCloseEditModal}
                  task={task}
                  editedTask={editedTask}
                  onSave={handleSaveEditedTask}
                />
              </Box>
            </Box>
            <Box>
              {editedTask.taskImage && (
                <img
                  src={editedTask.taskImage}
                  alt="Task Image"
                  className="img-fluid"
                  style={{ width: "100%", height: "106px" }}
                />
              )}
            </Box>
            {editedTask.taskText && (
              <Box px={2} py={1}>
                <Typography variant="body2">{editedTask.taskText}</Typography>
              </Box>
            )}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={1}
            >
              <Stack direction="row" gap={1}>
                <IconCalendar size="1rem" />
                <Typography variant="body2">
                  {formatDate(editedTask.date)}
                </Typography>
              </Stack>
              <Box>
                <Chip
                  size="small"
                  label={editedTask.taskProperty}
                  sx={{
                    backgroundColor,
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: 400,
                  }}
                />
              </Box>
            </Box>
          </BlankCard>
        </Box>
      )}
    </Draggable>
  );
};
export default TaskData;
