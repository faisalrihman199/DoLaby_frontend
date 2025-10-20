const WardrobeFilters = () => {
  return (
    <div className="border border-[#054AB2] rounded-lg p-2 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium text-color-primary font-kanit  text-foreground">Filter</span>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit ">Brands</label>
          <select className="px-2 py-0 border border-[#035477] rounded text-sm bg-[#F6F6F6]">
            <option>All</option>
            <option>H&M</option>
            <option>Zara</option>
            <option>Uniqlo</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Category</label>
          <select className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]">
            <option>All</option>
            <option>Formal</option>
            <option>Casual</option>
            <option>Sport</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Season</label>
          <select className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]">
            <option>All</option>
            <option>Summer</option>
            <option>Winter</option>
            <option>Spring</option>
            <option>Fall</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Event</label>
          <select className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]">
            <option>All</option>
            <option>Wedding</option>
            <option>Party</option>
            <option>Work</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground font-kanit">Color</label>
          <select className="px-2 py-0 border  rounded text-sm bg-[#F6F6F6] border-[#035477]">
            <option>All</option>
            <option>Black</option>
            <option>White</option>
            <option>Blue</option>
            <option>Green</option>
          </select>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <span className="text-sm text-muted-foreground font-kanit">Status</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm font-kanit">Ironed</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm font-kanit">Washed</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default WardrobeFilters;
