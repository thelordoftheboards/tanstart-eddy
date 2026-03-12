import { type IconProps } from '@tabler/icons-react';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldTabListNumber({
  label,
  description,
  options,
  className,
}: {
  label: string;
  description?: string;
  options: {
    value: string;
    text: string;
    icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  }[];
  className?: string;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValidating = field.state.meta.isValidating;

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Tabs onValueChange={(value) => field.handleChange(value)} value={field.state.value}>
        <TabsList
          className="grid w-full grid-cols-2-xxxx gap-2"
          style={{
            gridTemplateColumns: `repeat(${options.length}, 1fr)`,
          }}
        >
          {options.map((option) => (
            <TabsTrigger className="gap-2-xxxxx" key={option.value} value={option.value}>
              {option.icon && <option.icon className="h-4 w-4" />}
              {option.text}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {isValidating && 'Validating ...'}
    </Field>
  );
}
