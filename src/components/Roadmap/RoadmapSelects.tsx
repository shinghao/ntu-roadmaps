import { Stack, Autocomplete, TextField } from "@mui/material";

export default function RoadmapSelects({
  selectsConfig,
}: {
  selectsConfig: {
    options: string[];
    label: string;
    value: string;
    onChange: (value: string) => void;
    width?: number;
  }[];
}) {
  return (
    <Stack spacing={3} direction="row" flexWrap="wrap" useFlexGap>
      {selectsConfig
        .filter((config) => !config.options || config.options.length > 0) // Filter out configs that have previous requirements
        .map((config) => (
          <Autocomplete
            freeSolo
            key={`select-${config.label}`}
            disablePortal
            id={`select-${config.label}`}
            options={config.options}
            sx={{ width: config.width || 200 }}
            renderInput={(params) => (
              <TextField {...params} label={config.label} />
            )}
            value={config.value}
            onChange={(_, value) => config.onChange(value)}
            disableClearable
          />
        ))}
    </Stack>
  );
}
