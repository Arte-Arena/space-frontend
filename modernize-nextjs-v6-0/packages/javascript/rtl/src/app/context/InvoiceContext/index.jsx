'use client'
import React, { createContext, useEffect, useState } from 'react';
import axios from '@/utils/axios';


export const InvoiceContext = createContext(undefined); 

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState (null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/data/invoicedata');
                setInvoices(response.data);
                setLoading(false);
            } catch (error) {
                // setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to delete an invoice
    const deleteInvoice = async (id) => {
        try {

            await axios.delete('/api/data/invoicedata/deleteinvoice', { data: { invoiceId: id } });
            setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
        } catch (error) {
            console.error('Error deleting invoice:', error);

        }
    };

    const addInvoice = async (newInvoice) => {
        try {
            const response = await axios.post('/api/data/invoicedata/addinvoice', newInvoice);
            const addedInvoice = response.data;
            setInvoices((prevInvoices) => [...prevInvoices, addedInvoice]);
        } catch (error) {
            console.error('Error adding invoice:', error);
        }
    };

    //  Function to update an invoice
    const updateInvoice = async (updatedInvoice) => {
        try {
            const response = await axios.put('/api/data/invoicedata/updateinvoice', updatedInvoice);
            const updated = response.data;
            setInvoices((prevInvoices) =>
                prevInvoices.map((invoice) => (invoice.id === updated.id ? updated : invoice))
            );
        } catch (error) {
            console.error('Error updating invoice:', error);
        }
    };

    return (
        <InvoiceContext.Provider value={{ invoices, loading, error, deleteInvoice, addInvoice, updateInvoice }}>
            {children}
        </InvoiceContext.Provider>
    );
};
