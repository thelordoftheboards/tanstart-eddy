import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '../hooks/form-context';

export function FormFieldPassword({
  label,
  description,
  placeholder,
  className,
}: {
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const ivValidating = field.state.meta.isValidating;

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <div className="relative flex w-full items-center justify-end">
        <Input
          autoComplete="new-password"
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          type={isPasswordVisible ? 'text' : 'password'}
          value={field.state.value}
        />
        <Button
          className="absolute mr-2 h-7 w-7 rounded-full"
          onClick={(e) => {
            e.preventDefault();
            setIsPasswordVisible(!isPasswordVisible);
          }}
          size="icon"
          tabIndex={-1}
          type="button"
          variant="ghost"
        >
          {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {ivValidating && 'Validating ...'}
    </Field>
  );
}
