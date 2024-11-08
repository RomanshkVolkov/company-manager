'use client';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import React from 'react';

type FileAccepts = 'text/xlsx' | 'image/*' | 'application/pdf';

export default function File({
  id,
  accept,
}: {
  id: string;
  accept?: FileAccepts;
}) {
  const [files, setFiles] = React.useState<FileList | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFiles(files);
      const input = document.getElementById(id) as HTMLInputElement;
      input.files = files;
    }
  };

  const handleOnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    input.classList.toggle('border-blue-500');
  };
  return (
    <div
      className="w-full border-2 border-dashed"
      onDrop={handleDrop}
      onDragOver={handleOnDragOver}
    >
      <label className="cursor-pointer p-6">
        <input
          id={id}
          name={`file_input_${id}`}
          type="file"
          hidden
          multiple
          accept={accept}
          onChange={(e) => setFiles(e.target.files)}
        />
        <div className="flex flex-col justify-center">
          <CloudArrowUpIcon className="mx-auto h-16 w-16 text-foreground-400" />
          <span className="p-6 text-center">
            Arrastra y suelta un archivo aquí o haz clic para seleccionar uno
          </span>
          <strong className="text-center">
            {files?.length
              ? files.length > 1
                ? `Se han seleccionado ${files.length} archivos`
                : `${files[0].name}`
              : 'No se ha seleccionado un archivo'}
          </strong>
        </div>
      </label>
    </div>
  );
}
