import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FormatSize } from "~/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;

      setFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const maxFileSize = 20 * 1024 * 1024; // 20 MB

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <img src="/icons/info.svg" alt="upload" className="size-20" />
          </div>

          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-lg text-gray-500 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
                <img src="/images/pdf.png" alt="PDF" className="size-10" />
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <span className="text-sm text-gray-500">
                    ({FormatSize(file.size)})
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFile(null);
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" alt="Remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> Or drag &
                drop
              </p>
              <p className="text-lg text-gray-500">
                PDF ( max {FormatSize(maxFileSize)} )
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
