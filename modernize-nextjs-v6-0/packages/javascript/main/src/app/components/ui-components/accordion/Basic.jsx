'use client'
import React from 'react';
import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Divider,
} from '@mui/material';
import ChildCard from '@/app/components/shared/ChildCard';

import { IconChevronDown } from '@tabler/icons-react';

import BasicCode from "@/app/components/ui-components/accordion/code/BasicCode";


const Basic = () => {

    return (

        <ChildCard title="Basic" codeModel={<BasicCode />}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="h6">Accordion 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1" color="textSecondary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
                        lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider />
            <Accordion>
                <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography variant="h6">Accordion 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1" color="textSecondary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
                        lacus ex, sit amet blandit leo lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider />
            <Accordion disabled>
                <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography variant="h6">Disabled Accordion</Typography>
                </AccordionSummary>
            </Accordion>
        </ChildCard>

    );
};
export default Basic;
