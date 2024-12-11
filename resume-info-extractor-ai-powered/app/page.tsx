// "use client";

// import * as React from "react";
// import { useForm } from "react-hook-form";
// import InputWithBadges from "@/components/inputs/InputWithBadges";
// import PdfUpload from "@/components/inputs/PdfUpload";
// import { InputWithLabel } from "@/components/inputs/InputWithLabel";
// import { useState } from "react";

// interface FormValues {
//   skill: string;
//   fullname: string;
//   email: string;
//   phone: string;
//   address: string;
//   pdfFile: File | null;
// }

// export default function Page() {
//   const [skills, setSkills] = React.useState<string[]>([]);
//   const [isExtracting, setIsExtracting] = useState(false);
//   const { register, handleSubmit, reset, setValue, watch } =
//     useForm<FormValues>({
//       defaultValues: {
//         pdfFile: null,
//       },
//     });
//   const pdfFile = watch("pdfFile");
//   const onDrop = React.useCallback(
//     async (acceptedFiles: File[]) => {
//       if (acceptedFiles.length > 0) {
//         setValue("pdfFile", acceptedFiles[0]);

//         // Show loading state
//         setIsExtracting(true);

//         try {
//           const formData = new FormData();
//           formData.append("resume", acceptedFiles[0]);

//           const response = await fetch("http://localhost:5000/api/extract", {
//             method: "POST",
//             body: formData,
//           });

//           const data = await response.json();

//           // Fill form with extracted data
//           setValue("fullname", data.pdfData.fullname || "");
//           setValue("email", data.pdfData.email || "");
//           setValue("phone", data.pdfData.phone || "");
//           setValue("address", data.pdfData.address || "");

//           // Handle skills array
//           if (data.pdfData.skills) {
//             setSkills(
//               Array.isArray(data.pdfData.skills)
//                 ? data.pdfData.skills
//                 : [data.pdfData.skills]
//             );
//           }
//         } catch (error) {
//           console.error("Error extracting data:", error);
//         } finally {
//           setIsExtracting(false);
//         }
//       }
//     },
//     [setValue]
//   );

//   // this function is never used because submiting the form was the the intention
//   const onSubmit = (data: FormValues) => {
//     if (data.skill && !skills.includes(data.skill)) {
//       setSkills([...skills, data.skill]);
//       reset();
//     }
//   };
//   const removeFile = () => {
//     setValue("pdfFile", null);
//     reset();
//     setSkills([]);
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto space-y-4 py-10">
//       {isExtracting && (
//         <div className="text-center py-2 bg-blue-100 rounded-md">
//           Extracting data from PDF...
//         </div>
//       )}
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="flex flex-col gap-4 ">
//           <PdfUpload
//             onDrop={onDrop}
//             pdfFile={pdfFile}
//             removeFile={removeFile}
//           />
//           <InputWithLabel
//             {...register("fullname")}
//             label="fullname"
//             type="text"
//             id="fullname"
//           />
//           <InputWithLabel
//             {...register("email")}
//             label="email"
//             type="email"
//             id="email"
//           />
//           <InputWithBadges
//             {...register("skill")}
//             // className="flex-1"
//             tabs={skills}
//             setTabs={setSkills}
//             label="skills"
//           />
//           <InputWithLabel
//             {...register("phone")}
//             label="phone"
//             type="tel"
//             id="phone"
//           />
//           <InputWithLabel
//             {...register("address")}
//             label="address"
//             type="text"
//             id="address"
//           />
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import InputWithBadges from "@/components/inputs/InputWithBadges";
import PdfUpload from "@/components/inputs/PdfUpload";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface FormValues {
  skill: string[];
  fullname: string;
  email: string;
  phone: string;
  address: string;
  pdfFile: File | null;
}

export default function Page() {
  const [isExtracting, setIsExtracting] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, control } =
    useForm<FormValues>({
      defaultValues: {
        pdfFile: null,
        skill: [], // Initialize skills as an empty array
      },
    });
  const pdfFile = watch("pdfFile");
  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setValue("pdfFile", acceptedFiles[0]);

        // Show loading state
        setIsExtracting(true);

        try {
          const formData = new FormData();
          formData.append("resume", acceptedFiles[0]);

          const response = await fetch("http://localhost:5000/api/extract", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          // Fill form with extracted data
          setValue("fullname", data.pdfData.fullname || "");
          setValue("email", data.pdfData.email || "");
          setValue("phone", data.pdfData.phone || "");
          setValue("address", data.pdfData.address || "");

          // Handle skills array
          if (data.pdfData.skills) {
            setValue(
              "skill",
              Array.isArray(data.pdfData.skills)
                ? data.pdfData.skills
                : [data.pdfData.skills]
            );
          }
        } catch (error) {
          console.error("Error extracting data:", error);
        } finally {
          setIsExtracting(false);
        }
      }
    },
    [setValue]
  );

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Handle form submission
  };

  const removeFile = () => {
    setValue("pdfFile", null);
    reset();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 py-10">
      {isExtracting && (
        <div className="text-center py-2 bg-blue-100 rounded-md">
          Extracting data from PDF...
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 ">
          <PdfUpload
            onDrop={onDrop}
            pdfFile={pdfFile}
            removeFile={removeFile}
          />
          <InputWithLabel
            {...register("fullname")}
            label="fullname"
            type="text"
            id="fullname"
          />
          <InputWithLabel
            {...register("email")}
            label="email"
            type="email"
            id="email"
          />
          <InputWithBadges<FormValues>
            control={control}
            name="skill"
            label="skills"
          />
          <InputWithLabel
            {...register("phone")}
            label="phone"
            type="tel"
            id="phone"
          />
          <InputWithLabel
            {...register("address")}
            label="address"
            type="text"
            id="address"
          />
          {/* <Button type="submit">Submit</Button> */}
          <Button >Submit</Button>
        </div>
      </form>
    </div>
  );
}
