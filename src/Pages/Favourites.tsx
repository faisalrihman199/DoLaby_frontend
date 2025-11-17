import React, { useState, useEffect } from 'react';
import { useAPI } from '../contexts/ApiContext';
import WardrobeFilters from '../components/Wardrobe/WardrobeFilters';
import OutfitCard from '../components/Favourites/OutfitCard';
import Calendar from '../components/Favourites/Calendar';
import { WardrobeItem, Filters } from '../types/wardrobe';

const Favourites = () => {
    const api = useAPI();
    const [favouriteItems, setFavouriteItems] = useState<WardrobeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({
        category: "",
        brand: "",
        size: "",
        color: "",
        season: "",
        status: "",
    });

    // Fetch favourite wardrobe items from API
    useEffect(() => {
        const fetchFavouriteItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/wardrobe/favourites');
                const items = res?.data || res || [];
                setFavouriteItems(items);
            } catch (err: any) {
                console.error('Error fetching favourite items:', err);
                setError(err?.response?.data?.message || err?.message || 'Failed to load favourite items');
            } finally {
                setLoading(false);
            }
        };

        fetchFavouriteItems();
    }, [api]);

    // Filter items based on filters
    const getFilteredItems = () => {
        return favouriteItems.filter(item => {
            if (filters.category && item.category !== filters.category) return false;
            if (filters.brand && item.brand.name !== filters.brand) return false;
            if (filters.size && item.size !== filters.size) return false;
            if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
            if (filters.season && item.season !== filters.season) return false;
            if (filters.status && item.status !== filters.status) return false;
            return true;
        });
    };

    // Handle toggling favourite status
    const handleToggleFavourite = async (itemId: number) => {
        try {
            const item = favouriteItems.find(item => item.id === itemId);
            if (!item) return;

            // Since this is favourites page, we're removing from favourites
            const newFavouriteStatus = false;
            
            // Optimistically remove from the list
            setFavouriteItems(prev => prev.filter(item => item.id !== itemId));

            // Call API to update favourite status
            await api.put(`/wardrobe/${itemId}`, {
                favourite: newFavouriteStatus
            });
            
        } catch (err: any) {
            console.error('Error toggling favourite:', err);
            // Re-fetch the data on error to ensure consistency
            const res = await api.get('/wardrobe/favourites');
            const items = res?.data || res || [];
            setFavouriteItems(items);
        }
    };
    return (
        <div>
            <h1 className="text-3xl font-semibold text-color-primary text-center inter">
                Favorite Items
            </h1>
            
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className='my-4'>
                <WardrobeFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                    wardrobeItems={favouriteItems}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-lg text-gray-600">Loading favourite items...</div>
                </div>
            ) : (
                <div className="flex w-[100%]">
                    <div className="hidden md:block md:w-[10%] px-2">
                        <img src="src/assets/DummyWardrobe/AI_Bot/bot.png" alt="AI Bot"
                            className="max-w-full"
                        />
                    </div>
                    <div className="w-[100%] md:w-[90%] flex flex-wrap justify-start gap-1 md:gap-6">
                        {getFilteredItems().length > 0 ? (
                            getFilteredItems().map((item) => (
                                <OutfitCard 
                                    key={item.id} 
                                    item={item} 
                                    onToggleFavorite={handleToggleFavourite}
                                />
                            ))
                        ) : (
                            <div className="w-full text-center py-12">
                                <div className="text-lg text-gray-600">No favourite items found</div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Mark items as favourites in your wardrobe to see them here
                                </p>
                            </div>
                        )}
                        <Calendar />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Favourites