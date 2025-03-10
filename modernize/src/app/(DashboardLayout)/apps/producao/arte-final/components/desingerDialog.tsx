import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    CircularProgress,
} from "@mui/material";
import { IconAlertTriangle } from "@tabler/icons-react";
import { User } from "../types";
import useFetchUsersByRole from "./useGetUsersByRole";

interface AssignDesignerDialogProps {
    openDialogDesinger: boolean;
    onCloseDialogDesinger: () => void;
    rowId: string | number | null;
}

const AssignDesignerDialog: React.FC<AssignDesignerDialogProps> = ({
    openDialogDesinger,
    onCloseDialogDesinger,
    rowId,
}) => {

    const { users: designers, isLoadingUsers: isLoadingDesigners, errorUsers: errorDesigners } = useFetchUsersByRole("Designer");

    const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);

    const handleAssign = () => {
        // Lógica para atribuir o designer ao pedido


        console.log(`Row ID: ${rowId}, Designer: ${selectedDesigner ?? "Sem Designer"}`);
        onCloseDialogDesinger();
    };

    return (
        <Dialog open={openDialogDesinger} onClose={onCloseDialogDesinger} fullWidth >
            <DialogTitle>Atribuir Designer</DialogTitle>
            <DialogContent sx={{ minHeight: 'fitContent', paddingTop: 2 }}>
                <FormControl fullWidth>
                    <Typography>Selecione um Designer</Typography>
                    {errorDesigners && (
                        <Typography color="error">
                            <IconAlertTriangle /> Erro ao carregar designers {errorDesigners.message}
                        </Typography>
                    )}
                    {isLoadingDesigners && (
                        <Typography color="secondary">
                            <CircularProgress /> Carregando designers...
                        </Typography>
                    )}
                    <Select
                        sx={{ marginTop: 1, marginBottom: 2 }}
                        value={selectedDesigner}
                        onChange={(e) => setSelectedDesigner(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value={""}>Sem Designer</MenuItem>
                        {designers?.map((designer: User) => (
                            <MenuItem key={designer.id} value={designer.id}>
                                {designer.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseDialogDesinger} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleAssign} color="primary" variant="contained">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignDesignerDialog;
