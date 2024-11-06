"use client";

import React from "react";
import { Dayjs } from "dayjs";
import ChildCard from "@/app/components/shared/ChildCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import TimepickerCode from "@/app/components/forms/form-elements/date-time/code/TimepickerCode";

const MuiDateTimePicker = () => {
  const [value2, setValue2] = React.useState<Dayjs | null>(null);

  return (
    <ChildCard title="Timepicker" codeModel={<TimepickerCode />}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          value={value2}
          onChange={(newValue) => {
            setValue2(newValue);
          }}
          renderInput={(params) => (
            <CustomTextField
              size="small"
              {...params}
              fullWidth
              sx={{
                "& .MuiSvgIcon-root": {
                  width: "18px",
                  height: "18px",
                },
                "& .MuiFormHelperText-root": {
                  display: "none",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </ChildCard>
  );
};

export default MuiDateTimePicker;
