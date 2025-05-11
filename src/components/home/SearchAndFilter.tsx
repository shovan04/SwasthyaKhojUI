"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void; // Placeholder for filter functionality
}

export function SearchAndFilter({ searchTerm, onSearchChange, onFilterClick }: SearchAndFilterProps) {
  return (
    <div className="p-4 bg-card sticky top-[calc(5rem)] z-30 shadow-sm"> {/* Adjusted top for taller header (h-20 = 5rem) */}
      <div className="relative flex items-center gap-2 max-w-5xl mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="ডাক্তার বা হাসপাতাল খুঁজুন..." // Updated placeholder
          className="pl-10 pr-4 py-2 w-full rounded-lg"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search"
        />
        {/* Filter button placeholder - functionality not implemented yet */}
        {/* <Button variant="outline" size="icon" onClick={onFilterClick} aria-label="Filter options">
          <Filter className="h-5 w-5" />
        </Button> */}
      </div>
    </div>
  );
}
