// mongoose
export type ObjectAttribute = {
  [key: string]:
    | string
    | { [key: string]: string | number | boolean }
    | { [key: string]: string | number | boolean }[];
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Possibles properties
// type: no string
// default: string | number | boolean
// ref: string
// trim: boolean
function formatAttribute(
  attribute: string,
  value:
    | string
    | { [key: string]: string | number | boolean }
    | { [key: string]: string | number | boolean }[]
) {
  if (Array.isArray(value)) {
    const _attributesList = [];

    for (const [_attribute, _aValue] of Object.entries(value[0])) {
      if (typeof _aValue === 'string') {
        _attributesList.push(
          `${_attribute}: ${capitalizeFirstLetter(_aValue)}`
        );
      } else {
        _attributesList.push(`${_attribute}: ${_aValue}`);
      }
    }

    return `${attribute}: [
      {${_attributesList.join(', ')}},
    ],`;
  }

  if (typeof value === 'object') {
    const _attributesList = [];

    for (const [_attribute, _aValue] of Object.entries(value)) {
      if (typeof _aValue === 'string') {
        _attributesList.push(
          `${_attribute}: ${capitalizeFirstLetter(_aValue)}`
        );
      } else {
        _attributesList.push(`${_attribute}: ${_aValue}`);
      }
    }

    return `${attribute}: {${_attributesList.join(', ')}},`;
  }

  if (Array.isArray(value)) {
    return '';
  }

  return `${attribute}: ${capitalizeFirstLetter(value)},`;
}

function getAttributes(attributesList: string | ObjectAttribute) {
  const modelAttributes = [];
  for (const [key, value] of Object.entries(attributesList)) {
    modelAttributes.push(formatAttribute(key, value));
  }
  return modelAttributes.join('');
}

export function mongooseJsModel(
  name: string,
  attributes: string | ObjectAttribute
) {
  const modelName = capitalizeFirstLetter(name);
  const schemaName = `${modelName?.toLocaleLowerCase()}Schema`;

  return `
const mongoose = require("mongoose");

const ${schemaName} = new mongoose.Schema({
  ${getAttributes(attributes)}
});

const ${modelName} = mongoose.model("${modelName}", ${schemaName});

module.exports = ${modelName};
`;
}

export function mongooseTsModel(
  name: string,
  attributes: string | ObjectAttribute
) {
  const modelName = capitalizeFirstLetter(name);
  const documentName = `${modelName}Document`;
  const schemaName = `${modelName?.toLocaleLowerCase()}Schema`;

  return `
import { Document, Schema, model } from 'mongoose';

export interface ${modelName}Document extends Document {
  active: boolean;
  text: string;
}

const ${schemaName} = new Schema(
  {
    ${getAttributes(attributes)}
  },
  {
    timestamps: true,
  }
);

export const ${modelName} = model<${documentName}>('${modelName}', ${schemaName});
`;
}

// prisma
