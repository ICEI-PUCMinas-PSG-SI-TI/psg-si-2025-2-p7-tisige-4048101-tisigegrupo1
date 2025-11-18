import React from 'react';
import { Beer, Utensils, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RegisterProductDialog } from './RegisterProductDialog';
import { RegisterCustomerDialog } from './RegisterCustomerDialog';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-dark border-b border-border py-3 sm:py-4 px-3 sm:px-4">
      <div className="w-full mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Beer className="h-5 w-5 sm:h-6 sm:w-6 text-beer" />
            <h1 className="text-xl sm:text-2xl font-bold text-beer text-center">Boteco do Morcego</h1>
            <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-beer" />
          </Link>

          {/* Menu Actions */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link to="/cozinha" className="flex-shrink-0">
              <Button size="sm" variant="outline" className="border-beer text-beer hover:bg-beer/10 h-9 sm:h-10 whitespace-nowrap">
                <ChefHat className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="text-xs sm:text-sm">Cozinha</span>
              </Button>
            </Link>
            <RegisterCustomerDialog />
            <RegisterProductDialog />
          </div>
        </div>
      </div>
    </header>
  );
};
