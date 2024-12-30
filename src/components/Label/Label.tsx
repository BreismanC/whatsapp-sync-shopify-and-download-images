interface Props {
  label: string;
  htmlFor: string;
}

export const Label = ({ label, htmlFor }: Props) => {
  return (
    <label htmlFor={htmlFor} className="text-sm font-bold text-gray-700">
      {label}
    </label>
  );
};
