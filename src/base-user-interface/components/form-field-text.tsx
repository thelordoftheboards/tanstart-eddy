import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldText({
  autoComplete,
  className,
  description,
  label,
  nullable,
  placeholder,
  type,
}: {
  autoComplete?: string;
  className?: string;
  description?: string;
  label: string;
  nullable?: boolean;
  placeholder?: string;
  type?: string;
}) {
  const field = useFieldContext<string | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValidating = field.state.meta.isValidating;

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
        onChange={(e) => field.handleChange(nullable && e.target.value === '' ? null : e.target.value)}
        placeholder={placeholder}
        type={type}
        value={field.state.value ?? ''}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {isValidating && 'Validating ...'}
    </Field>
  );
}
