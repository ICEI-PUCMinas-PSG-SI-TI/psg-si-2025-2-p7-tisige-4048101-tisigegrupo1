import React from 'react';
import { Beer, Utensils, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RegisterProductDialog } from './RegisterProductDialog';
import { RegisterCustomerDialog } from './RegisterCustomerDialog';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-dark border-b border-border py-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo/Title */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Beer className="h-6 w-6 text-beer" />
          <h1 className="text-2xl font-extrabold text-beer tracking-tight">Boteco do Morcego</h1>
          <Utensils className="h-5 w-5 text-beer" />
        </Link>

        {/* Menu Actions */}
        <div className="flex gap-3 items-center">
          <Link to="/cozinha">
            <Button size="sm" variant="ghost" className="border-beer text-beer hover:bg-beer/10">
              <ChefHat className="mr-2 h-4 w-4" />
              Cozinha
            </Button>
          </Link>
          <RegisterCustomerDialog />
          <RegisterProductDialog />
        </div>
      </div>
    </header>
  );
};
