/** biome-ignore-all lint/style/noSubstr: Allow */

import { Popover as BaseUiPopover } from '@base-ui/react/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldIsoDate({
  className,
  description,
  label,
  nullable,
}: {
  className?: string;
  description?: string;
  label: string;
  nullable?: boolean;
}) {
  const field = useFieldContext<string | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const isValidating = field.state.meta.isValidating;
  const { value } = field.state;

  const valueDate = value
    ? new Date(
        Number.parseInt(value.substring(0, 4), 10),
        Number.parseInt(value.substring(5, 7), 10) - 1,
        Number.parseInt(value.substring(8, 10), 10)
      )
    : new Date();

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
          {value ? format(valueDate, 'MM/dd/yy') : <span>Pick a date</span>}
        </PopoverTrigger>
        <PopoverContent className="mt-1 w-auto p-0">
          <Calendar
            captionLayout="dropdown"
            endMonth={new Date(new Date().getFullYear() + 5, 1, 1)}
            mode="single"
            onSelect={(newValue) => {
              if (newValue) {
                field.handleChange(newValue.toISOString().split('T')[0]);
              }
            }}
            selected={valueDate}
          />

          <div className="flex p-2">
            {nullable && <Button onClick={() => field.setValue(null)}>Clear</Button>}
            <div className="flex-1" />
            <BaseUiPopover.Close render={<Button variant="outline" />}>Close</BaseUiPopover.Close>
          </div>
        </PopoverContent>
      </Popover>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {isValidating && 'Validating ...'}
    </Field>
  );
}
