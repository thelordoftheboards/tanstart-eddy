import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldNumber({
  autoComplete,
  label,
  description,
  placeholder,
  className,
  type,
}: {
  autoComplete?: string;
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  const field = useFieldContext<number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValidating = field.state.meta.isValidating;
  const isValidNumber = typeof field.state.value === 'number' && !Number.isNaN(field.state.value);

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Input
        aria-invalid={isInvalid}
        autoComplete={autoComplete}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Number.parseInt(e.target.value, 10))}
        placeholder={placeholder}
        type={type}
        value={isValidNumber ? field.state.value : ''}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {isValidating && 'Validating ...'}
    </Field>
  );
}
