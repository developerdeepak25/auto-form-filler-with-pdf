import { X } from "lucide-react";
import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";

type PdfUploadProps = {
  onDrop: (acceptedFiles: File[]) => void;
  pdfFile: File | null;
  removeFile: () => void;
};

const PdfUpload = ({ onDrop, pdfFile, removeFile }: PdfUploadProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <>
      <div>
        <Label>PDF Upload</Label>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 hover:bg-muted/50 transition-colors mt-1",
            isDragActive
              ? "border-primary bg-muted/50"
              : "border-muted-foreground/25"
          )}
          // style={{
          //   padding: "32px",
          //   borderRadius: "16px",
          //   border: "2px dashed #e0e0e0",
          // }}
        >
          <input {...getInputProps()} />
          <div
            className="flex flex-col items-center justify-center gap-2 text-center"
            style={{
              flexDirection: "column",
            }}
          >
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">Upload Your PDF</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your PDF here, or click to select file
            </p>
            <p className="text-xs text-muted-foreground">
              PDF only. Max file size 10MB
            </p>
            <Button type="button" variant="secondary" className="mt-2">
              Select File
            </Button>
          </div>
        </div>
      </div>

      {pdfFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{pdfFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PdfUpload;
