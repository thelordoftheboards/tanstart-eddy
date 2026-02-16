import { Popover as BaseUiPopover } from '@base-ui/react/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldDate({
  label,
  description,
  nullable,
  className,
}: {
  label: string;
  description?: string;
  nullable?: boolean;
  className?: string;
}) {
  const field = useFieldContext<Date | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const ivValidating = field.state.meta.isValidating;
  const { value } = field.state;

  return (
    <Field className={className} data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              className="mt-1 w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              data-empty={!value}
              variant="outline"
            />
          }
        >
          <CalendarIcon />
          {value ? format(value, 'MM/dd/yy') : <span>Pick a date</span>}
        </PopoverTrigger>
        <PopoverContent className="mt-1 w-auto p-0">
          <Calendar
            captionLayout="dropdown"
            endMonth={new Date(new Date().getFullYear() + 5, 1, 1)}
            mode="single"
            onSelect={(newValue) => {
              if (newValue) {
                field.handleChange(newValue);
              }
            }}
            selected={value}
          />

          <div className="flex p-2">
            {nullable && <Button onClick={() => field.setValue(undefined)}>Clear</Button>}
            <div className="flex-1" />
            <BaseUiPopover.Close render={<Button variant="outline" />}>Close</BaseUiPopover.Close>
          </div>
        </PopoverContent>
      </Popover>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {ivValidating && 'Validating ...'}
    </Field>
  );
}
