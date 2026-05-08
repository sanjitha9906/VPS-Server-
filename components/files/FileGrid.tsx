import FileCard from "./FileCard";

export default function FileGrid() {
  return (
    <div className="grid grid-cols-4 gap-6">

      <FileCard
        name="Projects"
        type="folder"
      />

      <FileCard
        name="Backups"
        type="folder"
      />

      <FileCard
        name="nginx.conf"
        type="file"
      />

      <FileCard
        name="docker-compose.yml"
        type="file"
      />

    </div>
  );
}