import mongoose, { Schema, Model, Document } from "mongoose";

interface Feedback extends Document {
    name: string;
    email: string;
    message: string;
}

const FeedbackSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

const FeedbackModel: Model<Feedback> =
    mongoose.models.Feedback ||
    mongoose.model<Feedback>("Feedback", FeedbackSchema);

export default FeedbackModel;
