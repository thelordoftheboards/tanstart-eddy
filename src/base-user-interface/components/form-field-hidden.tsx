import { FieldError } from '~/components/ui/field';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldHidden() {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const ivValidating = field.state.meta.isValidating;

  return (
    <>
      <input type="hidden" value={field.state.value} />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {ivValidating && 'Validating ...'}
    </>
  );
}
