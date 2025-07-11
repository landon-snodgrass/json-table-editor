import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import { DataRow, SchemaType } from "../types";
import { useState } from "react";

interface DataTableProps {
  schema: SchemaType[];
  data: DataRow[];
  onDataChanged: (newData: DataRow[]) => void;
}

export const DataTable = ({ schema, data, onDataChanged }: DataTableProps) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const renderFieldInput = (
    field: SchemaType,
    value: any,
    onChange: (val: any) => void
  ) => {
    switch (field.type) {
      case "number":
        return (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4"
          />
        );
      case "enum":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="">Select...</option>
            {(field.enumValues || []).map((enumValue) => (
              <option key={enumValue} value={enumValue}>
                {enumValue}
              </option>
            ))}
          </select>
        );
      case "object":
        return (
          <textarea
            value={
              typeof value === "object" ? JSON.stringify(value, null, 2) : "{}"
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(parsed);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            className="w-full px-2 py-1 border rounded text-sm font-mono resize-none"
            rows={3}
            placeholder="{}"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        );
    }
  };

  const renderCellValue = (field: SchemaType, value: any) => {
    switch (field.type) {
      case "boolean":
        return value ? "✓" : "✗";
      case "object":
        return (
          <pre className="text-xs bg-gray-50 p-1 rounded max-w-xs overflow-hidden">
            {JSON.stringify(value, null, 2)}
          </pre>
        );
      default:
        return String(value || "");
    }
  };

  const addRow = () => {
    const newRow: DataRow = {};
    schema.forEach((field) => {
      switch (field.type) {
        case "number":
          newRow[field.id] = 0;
          break;
        case "boolean":
          newRow[field.id] = false;
          break;
        case "object":
          newRow[field.id] = {};
          break;
        case "enum":
          newRow[field.id] = field.enumValues?.[0] || "";
          break;
        default:
          newRow[field.id] = "";
      }
    });
    onDataChanged([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    onDataChanged(data.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onDataChanged(newData);
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {schema.map((field) => (
                <th
                  key={field.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                >
                  {field.name}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                  <div className="text-xs text-gray-500 font-normal">
                    ({field.id}: {field.type})
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-gray-50">
                {schema.map((field) => (
                  <td key={field.id} className="px-4 py-3">
                    {editingRow === rowIndex ? (
                      renderFieldInput(field, row[field.id], (value) =>
                        updateRow(rowIndex, field.id, value)
                      )
                    ) : (
                      <div className="min-h-[24px] flex items-center">
                        {renderCellValue(field, row[field.id])}
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {editingRow === rowIndex ? (
                      <button
                        onClick={() => setEditingRow(null)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingRow(rowIndex)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t bg-gray-50 px-4 py-3">
        <button
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={16} />
          Add Row
        </button>
      </div>
    </div>
  );
};
