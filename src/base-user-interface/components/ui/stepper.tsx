// Originally from https://www.creative-tim.com/ui/docs/components/stepper

import React from 'react';
import { cn } from '~/lib/utils';

const StepperContext = React.createContext<{
  activeStep: number;
  setActiveStep?: (step: number) => void;
}>({ activeStep: 0 });

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  onSetStep?: (value: number) => void;
  value?: number;
}

function Stepper({ className, value = 0, onSetStep, children, ...props }: StepperProps) {
  const [activeStep, setActiveStep] = React.useState(value);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveStep(value);
    }
  }, [value]);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
    onSetStep?.(step);
  };

  return (
    <StepperContext.Provider value={{ activeStep, setActiveStep: handleStepChange }}>
      <div className={cn('flex w-full items-center', className)} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  value: number;
}

function StepperItem({ className, value, disabled, children, ...props }: StepperItemProps) {
  const { activeStep, setActiveStep } = React.useContext(StepperContext);
  const isActive = activeStep === value;
  const isCompleted = activeStep > value;
  const isDisabled = disabled || activeStep < value;

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Allow
    // biome-ignore lint/a11y/noStaticElementInteractions: Allow
    // biome-ignore lint/a11y/useKeyWithClickEvents: Allow
    <div
      className={cn('flex w-full items-center', !isDisabled && 'cursor-pointer', className)}
      data-active={isActive}
      data-completed={isCompleted}
      data-disabled={isDisabled}
      onClick={() => !isDisabled && setActiveStep?.(value)}
      {...props}
    >
      {children}
    </div>
  );
}

function StepperHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex w-full items-center', className)} {...props} />;
}

function StepperSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-2 h-0.5 flex-1 transition-colors', className)} {...props} />;
}

function StepperIcon({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative z-10 flex size-10 items-center justify-center rounded-full border-2 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function StepperBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 text-center', className)} {...props} />;
}

export { Stepper, StepperItem, StepperHeader, StepperSeparator, StepperIcon, StepperBody };
