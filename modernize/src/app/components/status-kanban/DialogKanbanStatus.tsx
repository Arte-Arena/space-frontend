// import { Dialog, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";

// const DialogKanbanBoard: React.FC = () => {


//     return (
//       <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//         <DialogTitle>Alterar Status</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ marginBottom: "10px" }}>
//             {dialogData?.statusKey}
//           </Typography>
//           <DialogContentText>
//             Selecione a ação desejada para o status:
//           </DialogContentText>
//           <Typography>Status atual: {dialogData?.status}</Typography>
//           <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
//             <Button
//               variant="contained"
//               color="success"
//               disabled={dialogData?.status === dialogData?.approvedValue}
//               onClick={() => {
//                 if (dialogData?.statusKey === "status") {
//                   handleAprovarArteArena(dialogData.rowId);
//                 }
  
//                 if (dialogData) {
//                   handleAprovar(dialogData.statusKey, dialogData.rowId);
//                 }
  
//                 handleCloseDialog();
//               }}
//             >
//               Aprovar
//             </Button>
//             <Button
//               variant="contained"
//               color="error"
//               disabled={dialogData?.status !== dialogData?.approvedValue}
//               onClick={() => {
//                 if (dialogData) {
//                   handleDesaprovar(dialogData.statusKey, dialogData.rowId);
//                 }
//                 handleCloseDialog();
//               }}
//             >
//               Desaprovar
//             </Button>
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Fechar
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   };
  