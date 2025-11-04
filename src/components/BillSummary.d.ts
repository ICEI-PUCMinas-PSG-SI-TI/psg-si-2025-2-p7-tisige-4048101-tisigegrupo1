import React from 'react';
import { Table } from '@/types';
interface BillSummaryProps {
    table: Table;
    onBack: () => void;
    onClose: () => void;
}
export declare const BillSummary: React.FC<BillSummaryProps>;
export {};
