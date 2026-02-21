import { IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import { AlertDialogDelete } from '~/base-user-interface/components/alert-dialog-delete';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/base-user-interface/components/ui/dialog';
import { useAppForm } from '~/base-user-interface/hooks/form';
import { useScrollInsideDialog } from '~/base-user-interface/hooks/use-scroll-inside-dialog';
import { Button } from '~/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '~/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '~/components/ui/input-group';
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
      color: '',
      stallNumber: '',
      markings: [],
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
                  children={(field) => <field.FormFieldText label="Color" placeholder="Enter color" />}
                  name="color"
                />

                <form.AppField
                  children={(field) => <field.FormFieldText label="Stall Number" placeholder="Enter stall number" />}
                  name="stallNumber"
                />

                <form.Field mode="array" name="markings">
                  {(field) => {
                    return (
                      <FieldSet>
                        <div className="flex items-center justify-between gap-2">
                          <FieldContent>
                            <FieldLegend className="mb-0" variant="label">
                              Markings
                            </FieldLegend>
                            <FieldDescription>
                              Add markings - pathches on face and legs - e.g. star, snip, blaze, coronet, sock, etc.
                            </FieldDescription>
                            {field.state.meta.errors && <FieldError errors={field.state.meta.errors} />}
                          </FieldContent>
                          <Button
                            onClick={() => field.pushValue({ markingDescription: '' })}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            Add Marking
                          </Button>
                        </div>
                        <FieldGroup>
                          {field.state.value.map((_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: There is no other natural key
                            <form.Field key={index} name={`markings[${index}].markingDescription`}>
                              {(innerField) => {
                                const isInvalid = innerField.state.meta.isTouched && !innerField.state.meta.isValid;
                                return (
                                  <Field data-invalid={isInvalid} orientation="horizontal">
                                    <FieldContent>
                                      <InputGroup>
                                        <InputGroupInput
                                          aria-invalid={isInvalid}
                                          aria-label={`Marking ${index + 1} markingDescription`}
                                          id={innerField.name}
                                          onBlur={innerField.handleBlur}
                                          onChange={(e) => innerField.handleChange(e.target.value)}
                                          type="text"
                                          value={innerField.state.value}
                                        />
                                        {field.state.value.length > 1 && (
                                          <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                              aria-label={`Remove User ${index + 1}`}
                                              onClick={() => field.removeValue(index)}
                                              size="icon-xs"
                                              type="button"
                                              variant="ghost"
                                            >
                                              <IconX />
                                            </InputGroupButton>
                                          </InputGroupAddon>
                                        )}
                                      </InputGroup>
                                      {isInvalid && <FieldError errors={innerField.state.meta.errors} />}
                                    </FieldContent>
                                  </Field>
                                );
                              }}
                            </form.Field>
                          ))}
                        </FieldGroup>
                      </FieldSet>
                    );
                  }}
                </form.Field>
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
