"use client";

import { useRef } from "react";

import {
  Upload,
  FolderPlus,
  FilePlus,
} from "lucide-react";

export default function UploadButton() {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFolderUpload = () => {
    folderInputRef.current?.click();
  };

  return (
<div className="flex gap-4">

  {/* Upload File */}
  <label className="bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-2xl text-xl font-semibold cursor-pointer">

    Upload File

    <input
      type="file"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (file) {
          alert(`Uploaded file: ${file.name}`);
        }
      }}
    />

  </label>

  {/* Upload Folder */}
  <label className="bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-2xl text-xl font-semibold cursor-pointer">

    Upload Folder

    <input
      type="file"
      // @ts-ignore
      webdirectory=""
      multiple
      className="hidden"
      onChange={(e) => {
        const files = e.target.files;

        if (files && files.length > 0) {
          alert(`Uploaded folder with ${files.length} files`);
        }
      }}
    />

  </label>

</div>
     
  );
}