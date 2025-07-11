import React, { JSX, useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';

// Types
type DataType = 'string' | 'number' | 'boolean' | 'object' | 'enum';

type SchemaType = {
  id: string;
  name: string;
  type: DataType;
  required: boolean;
  enumValues?: string[];
};

type EnumInputs = Record<string, string>;

interface SchemaDefinitionProps {
  schema: SchemaType[];
  onSchemaChange: (schema: SchemaType[]) => void;
}

const SchemaDefinition: React.FC<SchemaDefinitionProps> = ({ 
  schema, 
  onSchemaChange 
}) => {
  const [editingSchema, setEditingSchema] = useState<boolean>(false);
  const [newField, setNewField] = useState<SchemaType>({ 
    id: '', 
    name: '', 
    type: 'string', 
    required: false, 
    enumValues: [] 
  });
  const [enumInputs, setEnumInputs] = useState<EnumInputs>({});

  const dataTypes: DataType[] = ['string', 'number', 'boolean', 'object', 'enum'];

  const updateSchemaField = (index: number, updates: Partial<SchemaType>): void => {
    const newSchema = [...schema];
    newSchema[index] = { ...newSchema[index], ...updates };
    onSchemaChange(newSchema);
  };

  const addField = (): void => {
    if (newField.id && newField.name && !schema.find(f => f.id === newField.id)) {
      onSchemaChange([...schema, { ...newField }]);
      setNewField({ id: '', name: '', type: 'string', required: false, enumValues: [] });
    }
  };

  const removeField = (fieldId: string): void => {
    onSchemaChange(schema.filter(f => f.id !== fieldId));
  };

  const saveEnumValues = (fieldKey: string, isNewField: boolean = false): void => {
    const inputValue = enumInputs[fieldKey] || '';
    const enumValues = inputValue.split('|').map(v => v.trim()).filter(v => v);
    
    if (isNewField) {
      setNewField({ ...newField, enumValues });
    } else {
      const fieldIndex = parseInt(fieldKey.replace('field_', ''));
      updateSchemaField(fieldIndex, { enumValues });
    }
    
    // Clear the input tracking
    const newInputs = { ...enumInputs };
    delete newInputs[fieldKey];
    setEnumInputs(newInputs);
  };

  const renderEnumInput = (
    fieldKey: string, 
    currentValues: string[] = [], 
    isNewField: boolean = false
  ): JSX.Element => (
    <div className="ml-4 bg-blue-50 p-3 rounded">
      <label className="block text-sm font-medium mb-2">Enum Values (separated by |):</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={enumInputs[fieldKey] !== undefined ? enumInputs[fieldKey] : currentValues.join(' | ')}
          onChange={(e) => {
            setEnumInputs({
              ...enumInputs,
              [fieldKey]: e.target.value
            });
          }}
          className="flex-1 px-2 py-1 border rounded text-sm"
          placeholder="weapon | consumable | armor"
        />
        <button
          onClick={() => saveEnumValues(fieldKey, isNewField)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Save
        </button>
      </div>
      {currentValues.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Current values: {currentValues.join(', ')}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Schema Definition</h2>
        <button
          onClick={() => setEditingSchema(!editingSchema)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Edit3 size={16} />
          {editingSchema ? 'Done' : 'Edit Schema'}
        </button>
      </div>

      {editingSchema && (
        <div className="space-y-4">
          {/* Existing Fields */}
          <div className="space-y-2">
            {schema.map((field, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3 bg-white p-3 rounded border">
                  <input
                    type="text"
                    value={field.id}
                    onChange={(e) => updateSchemaField(index, { id: e.target.value })}
                    className="px-2 py-1 border rounded"
                    placeholder="Field ID"
                  />
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateSchemaField(index, { name: e.target.value })}
                    className="px-2 py-1 border rounded flex-1"
                    placeholder="Field name"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => {
                      const newType = e.target.value as DataType;
                      const updates: Partial<SchemaType> = { type: newType };
                      if (newType !== 'enum') {
                        updates.enumValues = undefined;
                      } else if (!field.enumValues) {
                        updates.enumValues = [];
                      }
                      updateSchemaField(index, updates);
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    {dataTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateSchemaField(index, { required: e.target.checked })}
                    />
                    Required
                  </label>
                  <button
                    onClick={() => removeField(field.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {field.type === 'enum' && renderEnumInput(`field_${index}`, field.enumValues)}
              </div>
            ))}
          </div>

          {/* Add New Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white p-3 rounded border border-dashed">
              <input
                type="text"
                value={newField.id}
                onChange={(e) => setNewField({ ...newField, id: e.target.value })}
                className="px-2 py-1 border rounded"
                placeholder="Field ID"
              />
              <input
                type="text"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                className="px-2 py-1 border rounded flex-1"
                placeholder="Field name"
              />
              <select
                value={newField.type}
                onChange={(e) => {
                  const newType = e.target.value as DataType;
                  const updatedField: SchemaType = { ...newField, type: newType };
                  if (newType !== 'enum') {
                    updatedField.enumValues = undefined;
                  } else if (!updatedField.enumValues) {
                    updatedField.enumValues = [];
                  }
                  setNewField(updatedField);
                }}
                className="px-2 py-1 border rounded"
              >
                {dataTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                />
                Required
              </label>
              <button
                onClick={addField}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
            {newField.type === 'enum' && renderEnumInput('newField', newField.enumValues, true)}
          </div>
        </div>
      )}

      {!editingSchema && (
        <div className="flex flex-wrap gap-2">
          {schema.map((field, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
            >
              {field.id}: {field.name} ({field.type}{field.type === 'enum' ? `: ${(field.enumValues || []).join(' | ')}` : ''}) {field.required && '*'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemaDefinition;