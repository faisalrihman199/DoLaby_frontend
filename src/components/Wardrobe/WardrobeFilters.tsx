import { WardrobeItem, Filters } from "../../types/wardrobe";

interface WardrobeFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  wardrobeItems: WardrobeItem[];
}

const WardrobeFilters = ({ filters, onFiltersChange, wardrobeItems }: WardrobeFiltersProps) => {
  // Extract unique values from wardrobe items
  const uniqueBrands = Array.from(new Set(wardrobeItems.map(item => item.brand.name))).sort();
  const uniqueCategories = Array.from(new Set(wardrobeItems.map(item => item.category))).sort();
  const uniqueSeasons = Array.from(new Set(wardrobeItems.map(item => item.season))).sort();
  const uniqueColors = Array.from(new Set(wardrobeItems.map(item => item.color))).sort();
  const uniqueSizes = Array.from(new Set(wardrobeItems.map(item => item.size))).sort();

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  return (
    <div className="border border-[#054AB2] rounded-lg p-2 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium text-color-primary font-kanit  text-foreground">Filter</span>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit ">Brands</label>
          <select 
            className="px-2 py-0 border border-[#035477] rounded text-sm bg-[#F6F6F6]"
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <option value="">All</option>
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Category</label>
          <select 
            className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Season</label>
          <select 
            className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]"
            value={filters.season}
            onChange={(e) => handleFilterChange('season', e.target.value)}
          >
            <option value="">All</option>
            {uniqueSeasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Color</label>
          <select 
            className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]"
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
          >
            <option value="">All</option>
            {uniqueColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Size</label>
          <select 
            className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]"
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
          >
            <option value="">All</option>
            {uniqueSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <span className="text-sm text-muted-foreground font-kanit">Status</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded"
              checked={filters.status === 'ironed'}
              onChange={(e) => handleFilterChange('status', e.target.checked ? 'ironed' : '')}
            />
            <span className="text-sm font-kanit">Ironed</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded"
              checked={filters.status === 'washed'}
              onChange={(e) => handleFilterChange('status', e.target.checked ? 'washed' : '')}
            />
            <span className="text-sm font-kanit">Washed</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default WardrobeFilters;
