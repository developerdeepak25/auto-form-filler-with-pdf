import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";

  export const InputWithLabel = forwardRef<HTMLInputElement, { label: string;  type: string; id: string }>(({ label,  type, id }, ref) => {
  return (
    // <div className="flex flex-col w-full max-w-sm  gap-1.5 grow">
    <div className="flex flex-col w-full  gap-1.5 grow">
      <Label htmlFor={id}>{label}</Label>
      <Input type={type} id={id} ref={ref} />
    </div>
  );
});

InputWithLabel.displayName = "InputWithLabel";
