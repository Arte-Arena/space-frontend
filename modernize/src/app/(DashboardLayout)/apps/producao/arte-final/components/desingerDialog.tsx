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
    Typography,
    CircularProgress,
} from "@mui/material";
import { IconAlertTriangle } from "@tabler/icons-react";
import { User, ArteFinal } from "../types";
import useFetchUsersByRole from "./useGetUsersByRole";

interface AssignDesignerDialogProps {
    openDialogDesinger: boolean;
    onCloseDialogDesinger: () => void;
    row: ArteFinal | null;
}

const AssignDesignerDialog: React.FC<AssignDesignerDialogProps> = ({
    openDialogDesinger,
    onCloseDialogDesinger,
    row,
}) => {

    const { users: designers, isLoadingUsers: isLoadingDesigners, errorUsers: errorDesigners } = useFetchUsersByRole("Designer");

    const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);

    const handleAssign = () => {
        // Lógica para atribuir o designer ao pedido
        console.log(`Row ID: ${row?.id}, Designer: ${selectedDesigner ?? "Sem Designer"}`);

        if (row?.id !== null || row?.id !== undefined) {
            // fazer a chamada para a API para atribuir o designer ao pedido
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) throw new Error("Usuário não autenticado.");

            fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/atribuir-designer/${row?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ designer_id: selectedDesigner }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao atribuir designer');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Designer atribuído com sucesso:', data);
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
        }
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
                                {designer.id} - {designer.name}
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
