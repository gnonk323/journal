import { Schema, model, Document } from "mongoose";

export interface IEntry extends Document {
  content: string;
  tags: string[];
}

const EntrySchema = new Schema<IEntry>(
  {
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IEntry>("Entry", EntrySchema);
