import { AsYouType } from 'libphonenumber-js';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '../hooks/form-context';
import { type PhoneNumberType } from '../schema/phone-number';

export default function FormFieldPhoneNumber({
  label,
  description,
  placeholder,
  className,
  type,
}: {
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  const field = useFieldContext<PhoneNumberType>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const ivValidating = field.state.meta.isValidating;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const input = event.target.value;

    const formatted = new AsYouType('US').input(input);

    field.handleChange(formatted);
  };

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Input
        aria-invalid={isInvalid}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={field.state.value}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {ivValidating && 'Validating ...'}
    </Field>
  );
}
