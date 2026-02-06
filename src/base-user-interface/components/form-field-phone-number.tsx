import { AsYouType } from 'libphonenumber-js';
import FormFieldInfo from '~/base-user-interface/components/form-field-info';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';
import { useFieldContext } from '../hooks/form-context';
import { type PhoneNumberType } from '../schema/phone-number';

export default function FormFieldPhoneNumber({
  label,
  className,
  placeholder,
  type,
}: {
  label: string;
  className?: string;
  placeholder?: string;
  type?: string;
}) {
  const field = useFieldContext<PhoneNumberType>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const input = event.target.value;

    const formatted = new AsYouType('US').input(input);

    field.handleChange(formatted);
  };

  return (
    <div className={cn(className, 'my-2')}>
      <Label htmlFor={field.name}>{label}</Label>

      <Input
        className="mt-1"
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={field.state.value}
      />

      <FormFieldInfo field={field} />
    </div>
  );
}
