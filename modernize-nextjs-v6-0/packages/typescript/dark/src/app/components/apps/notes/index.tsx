"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NoteSidebar from "@/app/components/apps/notes/NoteSidebar";
import NoteContent from "@/app/components/apps/notes/NoteContent";

const NotesApp = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  return (
    <>
      {lgDown ? (
        <NoteSidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      ) : (
        <NoteSidebar
          isMobileSidebarOpen={true}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}

      <Box flexGrow={1}>
        <NoteContent
          toggleNoteSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
        />
      </Box>
    </>
  );
};

export default NotesApp;
