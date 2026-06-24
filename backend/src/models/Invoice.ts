import { Schema, model } from 'mongoose';

const invoiceProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
  },
  { _id: false }
);

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      required: false,
    },
    address: {
      type: String,
      trim: true,
      required: false,
    },
    gstNumber: {
      type: String,
      trim: true,
      required: false,
    },
    invoiceDate: {
      type: Date,
      required: [true, 'Invoice date is required'],
      default: Date.now,
    },
    products: {
      type: [invoiceProductSchema],
      validate: {
        validator: function (val: any) {
          return val && val.length > 0;
        },
        message: 'Invoice must contain at least one product',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    gstPercentage: {
      type: Number,
      required: [true, 'GST percentage is required'],
      min: [0, 'GST percentage cannot be negative'],
      default: 18,
    },
    gstAmount: {
      type: Number,
      required: [true, 'GST amount is required'],
      min: [0, 'GST amount cannot be negative'],
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required'],
      min: [0, 'Grand total cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Invoice = model('Invoice', invoiceSchema);
