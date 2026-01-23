import { toast } from 'sonner';
import { AlertDialogDelete } from '~/base/components/alert-dialog-delete';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/base/components/ui/dialog';
import { useAppForm } from '~/base/hooks/form';
import { useScrollInsideDialog } from '~/base/hooks/use-scroll-inside-dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useMutationHorseAdd } from '../client/mutation-horse-add';
import { useMutationHorseDelete } from '../client/mutation-horse-delete';
import { useMutationHorseUpdate } from '../client/mutation-horse-update';
import { type HorseType, horseNoIdSchema } from '../schema/horse';

export function DialogContentHorseEdit({
  setOpen,
  horse,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  horse?: HorseType;
}) {
  useScrollInsideDialog();

  const isEditing = !!horse;

  const mutationHorseAdd = useMutationHorseAdd({
    onSuccess: () => {
      toast.success('Horse added successfully');
    },
    onError: () => {
      toast.error('Failed to add horse');
    },
  });
  const mutationHorseDelete = useMutationHorseDelete({
    onSuccess: () => {
      toast.success('Horse deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete horse');
    },
  });
  const mutationHorseUpdate = useMutationHorseUpdate({
    onSuccess: () => {
      toast.success('Horse updated successfully');
    },
    onError: () => {
      toast.error('Failed to update horse');
    },
  });

  const handleDelete = () => {
    if (horse) {
      mutationHorseDelete.mutate({ id: horse.id });

      setOpen(false);
    }
  };

  const form = useAppForm({
    defaultValues: horse ?? {
      name: '',
      breed: '',
      birthYear: new Date().getFullYear(),
      colorAndMarkings: '',
      stallNumber: '',
    },
    validators: {
      onChange: horseNoIdSchema,
    },
    onSubmit: ({ value }) => {
      if (horse) {
        mutationHorseUpdate.mutate({ id: horse.id, ...value });
      } else {
        mutationHorseAdd.mutate(value);
      }

      setOpen(false);
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <ScrollArea className="flex max-h-[min(1000px,80vh)] flex-col overflow-hidden">
            <DialogTitle>{isEditing ? 'Edit Horse' : 'Add New Horse'}</DialogTitle>

            <div className="space-y-4 pr-4">
              <form.AppField
                children={(field) => <field.FormFieldText label="Horse Name" placeholder="Enter horse name" />}
                name="name"
              />
              <form.AppField
                children={(field) => <field.FormFieldText label="Horse Breed" placeholder="Enter horse breed" />}
                name="breed"
              />
              {
                // TODO /NEXT/ Create a number type app fields as formFieldNumber
              }
              <form.AppField
                children={(field) => (
                  <div className="my-2">
                    <Label htmlFor={field.name}>Birth Year</Label>
                    <Input
                      className="mt-1"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.handleChange(Number(e.target.value))}
                      placeholder="Enter birth year"
                      type="number"
                      value={field.state.value}
                    />
                  </div>
                )}
                name="birthYear"
              />
              <form.AppField
                children={(field) => (
                  <field.FormFieldText label="Color and Markings" placeholder="Enter color and markings" />
                )}
                name="colorAndMarkings"
              />
              <form.AppField
                children={(field) => <field.FormFieldText label="Stall Number" placeholder="Enter stall number" />}
                name="stallNumber"
              />
            </div>
          </ScrollArea>
        </form>
      </DialogHeader>

      <DialogFooter className="flex-row items-center border-t px-6 py-4">
        {isEditing && <AlertDialogDelete handleDelete={handleDelete} />}

        <form.Subscribe
          children={([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              {horse ? 'Update' : 'Add'}
            </Button>
          )}
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        />

        <div className="flex-1" />

        <Button onClick={() => setOpen(false)} variant="outline">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
