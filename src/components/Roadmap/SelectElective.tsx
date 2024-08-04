import { Box, Autocomplete, TextField } from "@mui/material";

interface props {
  selectedElective: string;
  onSelectElective: (elective: string) => void;
  availableElectives: string[];
}

export default function SelectElective({
  selectedElective,
  onSelectElective,
  availableElectives,
}: props) {
  return (
    <Box marginY={3}>
      <Autocomplete
        freeSolo
        key={`select-elective-field`}
        id={`select-elective`}
        options={availableElectives}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} label="Select Elective" />
        )}
        value={selectedElective}
        onChange={(_, value) => onSelectElective(value)}
        disableClearable
        defaultValue={""}
      />
    </Box>
  );
}
