type ObjectProperty = {
  [key: string]:
    | string
    | number
    | boolean
    | { [key: string]: string | number | boolean }
    | { [key: string]: string | number | boolean }[];
};

// Possibles properties
// type: no string
// default: string | number | boolean
// ref: string
// trim: boolean

export function mongooseJsModel(
  name: string,
  properties: string | ObjectProperty
) {
  const modelName = name;
  const schemaName = `${modelName?.toLocaleLowerCase()}Schema`;

  return `
const mongoose = require("mongoose");

const ${schemaName} = new mongoose.Schema({
  name: String,
  price: Number,
  inStock: Boolean
});

const ${modelName} = mongoose.model("${modelName}", ${schemaName});

module.exports = ${modelName};
`;
}

export function mongooseTsModel(
  name: string,
  properties: string | ObjectProperty
) {
  const modelName = name;
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
    active: {
      type: Boolean,
      require: [true, 'Please provide an active'],
    },
    text: {
      type: String,
      require: [true, 'Please provide a text'],
    },
  },
  {
    timestamps: true,
  }
);

export const ${modelName} = model<${documentName}>('${modelName}', ${schemaName});
`;
}
