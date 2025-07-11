import { DataRow, SchemaType } from "../types";

interface ExportPreviewProps {
  schema: SchemaType[];
  data: DataRow[];
}

export const ExportPreview = ({ schema, data }: ExportPreviewProps) => {
  const getExportPreview = (): string => {
    const idField = schema.find(
      (field) => field.id === "id" || field.name.toLowerCase() === "id"
    );

    if (idField) {
      const exportData: Record<string, any> = {};
      data.forEach((row) => {
        const itemId = row[idField.id];
        const { [idField.id]: _, ...properties } = row;
        exportData[itemId] = properties;
      });
      return JSON.stringify(exportData, null, 2);
    } else {
      const exportData: Record<string, any> = {};
      data.forEach((row, index) => {
        exportData[`item_${index + 1}`] = row;
      });
      return JSON.stringify(exportData, null, 2);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">
        Current Data (JSON Preview)
      </h3>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
        {getExportPreview()}
      </pre>
    </div>
  );
};
