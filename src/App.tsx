import { useState } from "react";
import { Plus, Trash2, Edit3, Download, Upload, Save, X } from "lucide-react";
import { DataRow, EnumInputs, FieldType, SchemaType } from "./types";
import SchemaDefinition from "./components/SchemaDefinition";
import { ExportPreview } from "./components/ExportPreview";
import { DataTable } from "./components/DataTable";
import { ImportExportControls } from "./components/ImpotExportControls";

const JsonTableEditor = () => {
  const [schema, setSchema] = useState<SchemaType[]>([
    { id: "id", name: "id", type: "string", required: true },
    {
      id: "max_stack_size",
      name: "Max Stack Size",
      type: "number",
      required: false,
    },
    { id: "stack_size", name: "stack_size", type: "number", required: false },
  ]);

  const [data, setData] = useState<DataRow[]>([
    { id: "apple", max_stack_size: 99, stack_size: 1 },
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          JSON Table Editor
        </h1>
        <p className="text-gray-600">
          Define your schema and build structured data with a visual interface
        </p>
      </div>

      <SchemaDefinition
        schema={schema}
        onSchemaChange={(newSchema: SchemaType[]) => setSchema(newSchema)}
      />

      <ImportExportControls
        schema={schema}
        data={data}
        onDataImported={(newData: DataRow[]) => setData(newData)}
        onSchemaImported={(newSchema: SchemaType[]) => setSchema(newSchema)}
      />

      <DataTable
        schema={schema}
        data={data}
        onDataChanged={(newData: DataRow[]) => setData(newData)}
      />

      <ExportPreview schema={schema} data={data} />
    </div>
  );
};

export default JsonTableEditor;
