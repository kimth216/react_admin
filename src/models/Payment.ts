import { PaymentMethod, PaymentStatus } from 'enums';

export interface ResponsePaymentForOrders {
  paymentMethod: PaymentMethod;
  paymentId: number;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  totalAmount: number;
  nicePayment: ResponseNicePaymentForOrders;
}

export interface ResponsePaymentForShipping {
  paymentDate: string;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}

export interface ResponseNicePaymentForOrders {
  transactionId: string;
}

export interface ResponseClientNicePaymentForOrder {
  virtualBankNumber: string;
  virtualBankName: string;
  paymentAuthDate: string;
  cardQuota: string;
  cardCode: string;
  transactionId: string;
  paymentBankName:string;
}

export interface ResponseClientPaymentForOrder {
  paymentId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate: string;
  totalAmount: number;
  paymentCanceled: string;
  nicePayment: ResponseClientNicePaymentForOrder;
  refundAccountBank: string;
  refundAccountDepositor: string;
  refundAccountNumber: string;
}
