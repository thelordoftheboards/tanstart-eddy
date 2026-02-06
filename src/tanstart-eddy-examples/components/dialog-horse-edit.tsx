import { useState } from 'react';
import { Dialog, DialogTrigger } from '~/base-user-interface/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { type HorseType } from '../schema/horse';
import { DialogContentHorseEdit } from './dialog-content-horse-edit';

interface DialogHorseEditProps {
  horse?: HorseType;
  isOpen?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DialogHorseEdit({ horse, isOpen, setOpen }: DialogHorseEditProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const handleSetOpen = setOpen ?? setInternalOpen;

  return (
    <Dialog onOpenChange={handleSetOpen} open={open}>
      {!horse && <DialogTrigger render={<Button>Add Horse</Button>} />}

      {open && <DialogContentHorseEdit horse={horse} setOpen={handleSetOpen} />}
    </Dialog>
  );
}
