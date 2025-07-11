import { Download, Upload } from "lucide-react";
import {
  DataRow,
  parseDataFromFile,
  parseSchemeFromFile,
  SchemaType,
} from "../types";

interface ImportExportControlsProps {
  schema: SchemaType[];
  data: DataRow[];
  onSchemaImported: (newSchema: SchemaType[]) => void;
  onDataImported: (newData: DataRow[]) => void;
}

export const ImportExportControls = ({
  schema,
  data,
  onSchemaImported,
  onDataImported,
}: ImportExportControlsProps) => {
  const exportSchema = () => {
    const jsonData = {
      schema: schema,
    };
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportData = () => {
    // Find the ID field to use as keys
    const idField = schema.find(
      (field) => field.id === "id" || field.name.toLowerCase() === "id"
    );

    let exportData: any;
    if (idField) {
      // Convert array to object keyed by ID
      exportData = {};
      data.forEach((row) => {
        const itemId = row[idField.id];
        const { [idField.id]: _, ...properties } = row; // Remove the ID from properties
        exportData[itemId] = properties;
      });
    } else {
      // Fallback: use array indices as keys
      exportData = {};
      data.forEach((row, index) => {
        exportData[`item_${index + 1}`] = row;
      });
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSchemaImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseSchemeFromFile(content);

      if (result.success && result.schema) {
        onSchemaImported(result.schema);
        alert("Schema successfully imported!");
      } else {
        alert("Import failed: " + result.error);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const handleDataImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseDataFromFile(content, schema);

      if (result.success && result.data) {
        onDataImported(result.data);
        alert("Data successfully imported!");
      } else {
        alert("IMport failed: " + result.error);
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="mb-4 flex gap-2">
      <button
        onClick={exportData}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <Download size={16} />
        Export Data
      </button>
      <button
        onClick={exportSchema}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <Download size={16} />
        Export Schema
      </button>

      {/* Schema Import */}
      <label className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer">
        <Upload size={16} />
        Import Schema
        <input
          type="file"
          accept=".json"
          onChange={handleSchemaImport}
          className="hidden"
        />
      </label>

      {/* Data Import */}
      <label className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 cursor-pointer">
        <Upload size={16} />
        Import Data
        <input
          type="file"
          accept=".json"
          onChange={handleDataImport}
          className="hidden"
        />
      </label>
    </div>
  );
};
