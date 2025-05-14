import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Field, useField, useFormikContext } from 'formik';

interface MoneyFieldProps extends NumericFormatProps {
  name: string;
  label: string;
}

const MoneyField = ({ name, label, ...props }: MoneyFieldProps) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <NumericFormat
      {...field}
      {...props}
      customInput={TextField}
      label={label}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      fullWidth
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error ? meta.error : props.helperText}
      onValueChange={(values) => {
        // Garante que o valor seja enviado como número
        setFieldValue(name, values.floatValue || 0);
      }}
    />
  );
};