import React from 'react';
import { OrderItem as OrderItemType } from '@/types';
interface OrderItemProps {
    order: OrderItemType;
    tableId: string;
}
export declare const OrderItem: React.FC<OrderItemProps>;
export {};
