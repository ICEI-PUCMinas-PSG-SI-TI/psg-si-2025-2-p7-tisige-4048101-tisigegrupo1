import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTablesContext } from '@/contexts/TablesContext';
import { TableCard } from '@/components/TableCard';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { TableManagement } from '@/components/TableManagement';
import { Header } from '@/components/Header';
import { Beer } from 'lucide-react';
const BotecoApp = () => {
    const { tables } = useTablesContext();
    const [selectedTableId, setSelectedTableId] = useState(null);
    const openTables = tables.filter(table => table.isOpen);
    if (selectedTableId) {
        return (_jsx(TableManagement, { tableId: selectedTableId, onBack: () => setSelectedTableId(null) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-center pt-6", children: _jsx(CreateTableDialog, {}) }), _jsx("div", { className: "container mx-auto px-4", children: openTables.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Beer, { className: "h-16 w-16 text-muted-foreground mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-muted-foreground mb-2", children: "Nenhuma mesa aberta" }), _jsx("p", { className: "text-muted-foreground", children: "Crie uma nova mesa para come\u00E7ar o atendimento" })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: openTables.map((table) => (_jsx(TableCard, { table: table, onSelect: setSelectedTableId }, table.id))) })) })] }));
};
const Index = () => {
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Header, {}), _jsx("div", { className: "p-6", children: _jsx(BotecoApp, {}) })] }));
};
export default Index;
