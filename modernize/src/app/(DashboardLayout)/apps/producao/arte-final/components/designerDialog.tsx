import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { ArteFinal } from "./types";
import { User } from "../types";
import { useRouter } from 'next/navigation';

interface AssignDesignerDialogProps {
    openDialogDesinger: boolean;
    onCloseDialogDesinger: () => void;
    row: ArteFinal | null;
    refetch: () => void;

}

const AssignDesignerDialog: React.FC<AssignDesignerDialogProps> = ({
    openDialogDesinger,
    onCloseDialogDesinger,
    row,
    refetch
}) => {
    const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);
    const router = useRouter();

    const designers = localStorage.getItem("designers");

    const designerList = designers ? typeof designers === 'string'
        ? JSON.parse(designers)
        : designers
        : [];

    const handleAssign = () => {
        if (!row?.id) {
            console.error("ID do pedido não encontrado");
            return;
        }

        // Chamada para a API para atribuir o designer ao pedido
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("Usuário não autenticado");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API}/api/producao/pedido-designer-change/${row.id}`, {
            method: 'PATCH',
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
                refetch();
            })
            .catch(error => {
                console.error('Erro:', error);
            });

        onCloseDialogDesinger();
    };

    return (
        <Dialog open={openDialogDesinger} onClose={onCloseDialogDesinger} fullWidth >
            <DialogTitle>Atribuir Designer</DialogTitle>
            <DialogContent sx={{ minHeight: 'fitContent', paddingTop: 2 }}>
                <FormControl fullWidth>
                    <Typography>Selecione um Designer</Typography>
                    <Select
                        sx={{ marginTop: 1, marginBottom: 2 }}
                        value={selectedDesigner}
                        onChange={(e) => setSelectedDesigner(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value={""}>Sem Designer</MenuItem>
                        {designerList?.map((designer: User) => (
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
