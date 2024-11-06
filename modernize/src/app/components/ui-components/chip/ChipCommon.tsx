"use client";

import React from "react";
import { Avatar, Chip, Grid } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import InlineItemCard from "@/app/components/shared/InlineItemCard";
import { IconCheck, IconChecks, IconMoodHappy } from "@tabler/icons-react";

import FilledCode from "@/app/components/ui-components/chip/code/FilledCode";
import OutlinedCode from "@/app/components/ui-components/chip/code/OutlinedCode";
import CustomIconCode from "@/app/components/ui-components/chip/code/CustomIconCode";
import CustomOutlinedIcon from "@/app/components/ui-components/chip/code/CustomOutlinedIcon";
import DisabledCode from "@/app/components/ui-components/chip/code/DisabledCode";
import SizesCode from "@/app/components/ui-components/chip/code/SizesCode";

const ChipCommon = () => {
  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} display="flex" alignItems="stretch">
        <ChildCard title="Filled" codeModel={<FilledCode />}>
          <InlineItemCard>
            <Chip avatar={<Avatar>M</Avatar>} label="Default Filled" />
            <Chip
              avatar={<Avatar>M</Avatar>}
              label="Default Deletable"
              onDelete={handleDelete}
            />
            <Chip
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />
              }
              label="Primary Filled"
              color="primary"
            />
            <Chip
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />
              }
              label="Primary Deletable"
              color="primary"
              onDelete={handleDelete}
            />
            <Chip
              icon={<IconMoodHappy />}
              label="Secondary Filled"
              color="secondary"
            />
            <Chip
              icon={<IconMoodHappy />}
              label="Secondary Deletable"
              color="secondary"
              onDelete={handleDelete}
            />
            <Chip
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />
              }
              label="Default Filled"
              color="success"
            />
            <Chip
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />
              }
              label="Default Deletable"
              color="success"
              onDelete={handleDelete}
            />
            <Chip
              icon={<IconMoodHappy />}
              label="Default Filled"
              color="warning"
            />
            <Chip
              icon={<IconMoodHappy />}
              label="Default Deletable"
              color="warning"
              onDelete={handleDelete}
            />
            <Chip
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />
              }
              label="Default Filled"
              color="error"
            />
            <Chip
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />
              }
              label="Default Deletable"
              color="error"
              onDelete={handleDelete}
            />
          </InlineItemCard>
        </ChildCard>
      </Grid>
      <Grid item xs={12} display="flex" alignItems="stretch">
        <ChildCard title="Outlined" codeModel={<OutlinedCode />}>
          <InlineItemCard>
            <Chip
              variant="outlined"
              avatar={<Avatar>M</Avatar>}
              label="Default Filled"
            />
            <Chip
              variant="outlined"
              avatar={<Avatar>M</Avatar>}
              label="Default Deletable"
              onDelete={handleDelete}
            />
            <Chip
              variant="outlined"
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />
              }
              label="Default Filled"
              color="primary"
            />
            <Chip
              variant="outlined"
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-4.jpg"} />
              }
              label="Default Deletable"
              color="primary"
              onDelete={handleDelete}
            />
            <Chip
              variant="outlined"
              icon={<IconMoodHappy />}
              label="Default Filled"
              color="secondary"
            />
            <Chip
              variant="outlined"
              icon={<IconMoodHappy />}
              label="Default Deletable"
              color="secondary"
              onDelete={handleDelete}
            />
            <Chip
              variant="outlined"
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />
              }
              label="Default Filled"
              color="success"
            />
            <Chip
              variant="outlined"
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />
              }
              label="Default Deletable"
              color="success"
              onDelete={handleDelete}
            />
            <Chip
              variant="outlined"
              icon={<IconMoodHappy />}
              label="Default Filled"
              color="warning"
            />
            <Chip
              variant="outlined"
              icon={<IconMoodHappy />}
              label="Default Deletable"
              color="warning"
              onDelete={handleDelete}
            />
            <Chip
              variant="outlined"
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />
              }
              label="Default Filled"
              color="error"
            />
            <Chip
              variant="outlined"
              avatar={
                <Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />
              }
              label="Default Deletable"
              color="error"
              onDelete={handleDelete}
            />
          </InlineItemCard>
        </ChildCard>
      </Grid>
      <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
        <ChildCard title="Custom Icon" codeModel={<CustomIconCode />}>
          <InlineItemCard>
            <Chip
              label="Custom Icon"
              color="primary"
              avatar={<Avatar>M</Avatar>}
              onDelete={handleDelete}
              deleteIcon={<IconCheck width={20} />}
            />
            <Chip
              label="Custom Icon"
              color="secondary"
              avatar={<Avatar>S</Avatar>}
              onDelete={handleDelete}
              deleteIcon={<IconChecks width={20} />}
            />
          </InlineItemCard>
        </ChildCard>
      </Grid>
      <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
        <ChildCard
          title="Custom outlined Icon"
          codeModel={<CustomOutlinedIcon />}
        >
          <InlineItemCard>
            <Chip
              label="Custom Icon"
              variant="outlined"
              color="primary"
              avatar={<Avatar>M</Avatar>}
              onDelete={handleDelete}
              deleteIcon={<IconCheck width={20} />}
            />
            <Chip
              label="Custom Icon"
              variant="outlined"
              color="secondary"
              avatar={<Avatar>S</Avatar>}
              onDelete={handleDelete}
              deleteIcon={<IconChecks width={20} />}
            />
          </InlineItemCard>
        </ChildCard>
      </Grid>
      <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
        <ChildCard title="Disabled" codeModel={<DisabledCode />}>
          <InlineItemCard>
            <Chip
              label="Custom Icon"
              disabled
              avatar={<Avatar>M</Avatar>}
              onDelete={handleDelete}
            />
            <Chip
              label="Custom Icon"
              color="primary"
              disabled
              avatar={<Avatar>S</Avatar>}
              onDelete={handleDelete}
            />
          </InlineItemCard>
        </ChildCard>
      </Grid>
      <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
        <ChildCard title="Sizes" codeModel={<SizesCode />}>
          <InlineItemCard>
            <Chip label="Small" size="small" color="primary" />
            <Chip label="Normal" color="primary" />
          </InlineItemCard>
        </ChildCard>
      </Grid>
    </Grid>
  );
};
export default ChipCommon;
