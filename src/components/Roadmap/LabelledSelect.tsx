import "./LabelledSelect.css";

interface props {
  onChangeFn: (e: { target: { value: string } }) => void;
  options: string[];
  selectName: string;
  label: string;
}

export default function LabelledSelect({
  onChangeFn,
  options,
  selectName,
  label,
}: props) {
  return (
    <label>
      {label}
      <select name={selectName} onChange={onChangeFn}>
        {options.map((option, index) => (
          <option key={option + index}>{option}</option>
        ))}
      </select>
    </label>
  );
}
