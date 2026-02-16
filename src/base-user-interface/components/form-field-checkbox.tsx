import { Checkbox } from '~/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldCheckbox({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const ivValidating = field.state.meta.isValidating;

  return (
    <Field className="flex items-center gap-3">
      <Checkbox
        // biome-ignore lint/complexity/noUselessTernary: Allow
        checked={field.state.value ? true : false}
        id={field.name}
        onCheckedChange={(value: boolean) => {
          field.setValue(`${value}`);
        }}
      />

      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {ivValidating && 'Validating ...'}
    </Field>
  );
}
