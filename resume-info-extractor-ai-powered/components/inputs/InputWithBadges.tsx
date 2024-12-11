// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@radix-ui/react-label";
// import { X } from "lucide-react";
// import React, { forwardRef } from "react";

// type InputWithBadgesProps = {
//   tabs: string[];
//   setTabs: (tabs: string[]) => void;
//   label: string;
// } & React.ComponentProps<typeof Input>;

// const InputWithBadges = forwardRef<HTMLInputElement, InputWithBadgesProps>(
//   ({ tabs, setTabs, label, ...rest }, ref) => {
//     const removeSkill = (skillToRemove: string) => {
//       setTabs(tabs.filter((skill) => skill !== skillToRemove));
//     };

//     return (
//       <div className="flex flex-col	 gap-2">
//       <Label >{label}</Label>
//         <div className="flex gap-2 ">
//           <Input ref={ref} className="flex-1" {...rest} />
//           <Button type="submit">Add</Button>
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {tabs.map((skill) => (
//             <Badge
//               key={skill}
//               variant="secondary"
//               className="flex items-center gap-1 px-3 py-1 text-sm "
//             >
//               {skill}
//               <button
//                 onClick={() => removeSkill(skill)}
//                 className="ml-1 hover:bg-muted rounded-full"
//               >
//                 <X className="h-3 w-3" />
//                 <span className="sr-only">Remove {skill}</span>
//               </button>
//             </Badge>
//           ))}
//         </div>
//       </div>
//     );
//   }
// );

// InputWithBadges.displayName = "InputWithBadges";

// export default InputWithBadges;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type InputWithBadgesProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
} & React.ComponentProps<typeof Input>;

function InputWithBadges<TFieldValues extends FieldValues>(
  { control, name, label, ...rest }: InputWithBadgesProps<TFieldValues>,
  ref: React.ForwardedRef<HTMLInputElement>
) 
{
  const [inputValue, setInputValue] = useState("");
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const addSkill = () => {
          if (inputValue && !value.includes(inputValue)) {
            onChange([...value, inputValue]);
            setInputValue("");
          }
        };

        const removeSkill = (skillToRemove: string) => {
          onChange(value.filter((skill: string) => skill !== skillToRemove));
        };

        return (
          <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
              <Input
                ref={ref}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                {...rest}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {value.map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {skill}</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
const ForwardedInputWithBadges = forwardRef(InputWithBadges) as {
  <T extends FieldValues>(
    props: InputWithBadgesProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
  ): React.ReactElement;
  displayName?: string;
};

ForwardedInputWithBadges.displayName = "InputWithBadges";

export default ForwardedInputWithBadges;
