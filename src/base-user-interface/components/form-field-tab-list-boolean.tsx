import { type IconProps } from '@tabler/icons-react';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldTabListBoolean({
  label,
  description,
  options,
  className,
}: {
  label: string;
  description?: string;
  options: {
    value: boolean;
    text: string;
    icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  }[];
  className?: string;
}) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const ivValidating = field.state.meta.isValidating;

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Tabs onValueChange={(value) => field.handleChange(value)} value={field.state.value}>
        <TabsList className="grid w-full grid-cols-2">
          {options.map((option) => (
            <TabsTrigger className="gap-2" key={option.value ? 1 : 0} value={option.value}>
              {option.icon && <option.icon className="h-4 w-4" />}
              {option.text}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {ivValidating && 'Validating ...'}
    </Field>
  );
}
