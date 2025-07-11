export type FieldType = "string" | "number" | "boolean" | "object" | "enum";

export type SchemaType = {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  enumValues?: string[];
};

export type DataRow = Record<string, any>;

export type EnumInputs = Record<string, string>;

export const dataTypes: FieldType[] = [
  "string",
  "number",
  "boolean",
  "object",
  "enum",
];

export type SchemaImportResult = {
  success: boolean;
  schema?: SchemaType[];
  error?: string;
};

export type DataImportResult = {
  success: boolean;
  data?: DataRow[];
  error?: string;
};

export const parseSchemeFromFile = (
  fileContent: string
): SchemaImportResult => {
  try {
    const parsed = JSON.parse(fileContent);

    if (parsed.schema && Array.isArray(parsed.schema)) {
      return {
        success: true,
        schema: parsed.schema,
      };
    }

    return {
      success: false,
      error:
        "Invalid schema file format. Expected a json object with a 'schema' property.",
    };
  } catch (error) {
    return {
      success: false,
      error: "INvalid JSON file",
    };
  }
};

export const parseDataFromFile = (
  fileContent: string,
  schema: SchemaType[]
): DataImportResult => {
  try {
    const parsed = JSON.parse(fileContent);

    if (parsed.data && Array.isArray(parsed.data)) {
      return {
        success: true,
        data: parsed.data,
      };
    }

    if (typeof parsed === "object" && !Array.isArray(parsed)) {
      const dataArray: DataRow[] = [];

      const idField = schema.find(
        (field) => field.id === "id" || field.name.toLowerCase() === "id"
      );

      if (idField) {
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            dataArray.push({
              [idField.id]: key,
              ...(value as Record<string, any>),
            });
          }
        });
      } else {
        Object.values(parsed).forEach((value, index) => {
          if (typeof value === "object" && value !== null) {
            dataArray.push(value as DataRow);
          }
        });
      }

      return {
        success: true,
        data: dataArray,
      };
    }

    if (Array.isArray(parsed)) {
      return {
        success: true,
        data: parsed,
      };
    }

    return {
      success: false,
      error: "INvalid data file format",
    };
  } catch (error) {
    return {
      success: false,
      error: "INvalid JSON File",
    };
  }
};
