import { type IconProps } from '@tabler/icons-react';
import FormFieldInfo from '~/base/components/form-field-info';
import { Label } from '~/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { useFieldContext } from '../hooks/form-context';

export default function FormFieldTabListBoolean({
  label,
  options,
  className,
}: {
  label: string;
  options: {
    value: boolean;
    text: string;
    icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
  }[];
  className?: string;
}) {
  const field = useFieldContext<boolean>();

  return (
    <div className={cn(className, 'my-2')}>
      <Label htmlFor={field.name}>{label}</Label>

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

      <FormFieldInfo field={field} />
    </div>
  );
}
