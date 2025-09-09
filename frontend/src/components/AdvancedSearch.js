import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Search, Filter, X } from 'lucide-react';

const AdvancedSearch = ({ 
  categories, 
  locations, 
  onSearch, 
  currentFilters = {},
  onFilterChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: currentFilters.searchTerm || '',
    category: currentFilters.category || 'All',
    location: currentFilters.location || 'All',
    ageRange: currentFilters.ageRange || [18, 65],
    hasImage: currentFilters.hasImage || false,
    hasContact: currentFilters.hasContact || false,
    sortBy: currentFilters.sortBy || 'recent'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      category: 'All',
      location: 'All',
      ageRange: [18, 65],
      hasImage: false,
      hasContact: false,
      sortBy: 'recent'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category !== 'All') count++;
    if (filters.location !== 'All') count++;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 65) count++;
    if (filters.hasImage) count++;
    if (filters.hasContact) count++;
    if (filters.sortBy !== 'recent') count++;
    return count;
  };

  const AdvancedSearchDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Search
          {getActiveFiltersCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
          <DialogDescription>
            Filter ads to find exactly what you're looking for
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Term */}
          <div>
            <Label htmlFor="search-term">Search Keywords</Label>
            <Input
              id="search-term"
              placeholder="Search in title and description..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age Range */}
          <div>
            <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years</Label>
            <div className="px-3 py-4">
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => handleFilterChange('ageRange', value)}
                max={80}
                min={18}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>18</span>
              <span>80</span>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-4">
            <Label>Additional Filters</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-image"
                checked={filters.hasImage}
                onCheckedChange={(checked) => handleFilterChange('hasImage', checked)}
              />
              <Label htmlFor="has-image" className="text-sm">Has photo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-contact"
                checked={filters.hasContact}
                onCheckedChange={(checked) => handleFilterChange('hasContact', checked)}
              />
              <Label htmlFor="has-contact" className="text-sm">Has contact info</Label>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <Label>Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="age-asc">Age (Youngest First)</SelectItem>
                <SelectItem value="age-desc">Age (Oldest First)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleApplyFilters} className="flex-1 bg-red-500 hover:bg-red-600">
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Quick Search Component (for main search bar)
  const QuickSearch = () => (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search ads..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
          className="pl-10"
        />
      </div>
      <AdvancedSearchDialog />
    </div>
  );

  return {
    QuickSearch,
    AdvancedSearchDialog,
    filters,
    getActiveFiltersCount
  };
};

export default AdvancedSearch;