import { toast } from 'sonner';
import { AlertDialogDelete } from '~/base-user-interface/components/alert-dialog-delete';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/base-user-interface/components/ui/dialog';
import { useAppForm } from '~/base-user-interface/hooks/form';
import { useScrollInsideDialog } from '~/base-user-interface/hooks/use-scroll-inside-dialog';
import { Button } from '~/components/ui/button';
import { FieldGroup } from '~/components/ui/field';
import { ScrollArea } from '~/components/ui/scroll-area';
import { useMutationHorseAdd } from '../client/mutation-horse-add';
import { useMutationHorseDelete } from '../client/mutation-horse-delete';
import { useMutationHorseUpdate } from '../client/mutation-horse-update';
import { type HorseNoIdType, type HorseType, horseNoIdSchema } from '../schema/horse';

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
    defaultValues: (horse ?? {
      name: '',
      breed: '',
      birthYear: new Date().getFullYear(),
      colorAndMarkings: '',
      stallNumber: '',
    }) satisfies HorseNoIdType as HorseNoIdType,
    validators: {
      onSubmit: horseNoIdSchema,
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
        <DialogTitle>{isEditing ? 'Edit Horse' : 'Add New Horse'}</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <ScrollArea className="flex max-h-[min(1000px,80vh)] flex-col overflow-hidden">
            <div className="space-y-4 pr-4">
              <FieldGroup className="gap-5">
                <form.AppField
                  children={(field) => <field.FormFieldText label="Horse Name" placeholder="Enter horse name" />}
                  name="name"
                />

                <form.AppField
                  children={(field) => <field.FormFieldText label="Horse Breed" placeholder="Enter horse breed" />}
                  name="breed"
                />

                <form.AppField
                  children={(field) => <field.FormFieldNumber label="Birth Year" placeholder="2021" />}
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
              </FieldGroup>
            </div>
          </ScrollArea>
        </form>
      </DialogHeader>

      <DialogFooter className="flex-row items-center border-t px-6 py-4">
        {isEditing && <AlertDialogDelete handleDelete={handleDelete} />}

        <form.Subscribe
          // @ts-expect-error Tanstack Form type issue
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
          // @ts-expect-error Tanstack Form type issue
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
