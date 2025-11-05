import React from 'react';
import { Table } from '@/types';
interface TableCardProps {
    table: Table;
    onSelect: (tableId: string) => void;
}
export declare const TableCard: React.FC<TableCardProps>;
export {};
