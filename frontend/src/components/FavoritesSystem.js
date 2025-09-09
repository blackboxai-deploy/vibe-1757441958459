import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, MapPin, Calendar, Eye, Trash2 } from 'lucide-react';

const FavoritesSystem = ({ currentUser, backendUrl }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    if (currentUser) {
      loadFavorites();
    }
  }, [currentUser]);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem(`favorites_${currentUser.id}`) || '[]';
    setFavorites(JSON.parse(savedFavorites));
  };

  const saveFavorites = (updatedFavorites) => {
    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const addToFavorites = (ad) => {
    const updatedFavorites = [...favorites, { ...ad, addedAt: new Date().toISOString() }];
    saveFavorites(updatedFavorites);
  };

  const removeFromFavorites = (adId) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== adId);
    saveFavorites(updatedFavorites);
  };

  const isInFavorites = (adId) => {
    return favorites.some(fav => fav.id === adId);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Men Seeking Women': 'bg-blue-100 text-blue-800 border-blue-200',
      'Women Seeking Men': 'bg-pink-100 text-pink-800 border-pink-200',
      'Men Seeking Men': 'bg-purple-100 text-purple-800 border-purple-200',
      'Women Seeking Women': 'bg-rose-100 text-rose-800 border-rose-200',
      'Casual Encounters': 'bg-orange-100 text-orange-800 border-orange-200',
      'Adult Services': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const addedAt = new Date(date);
    const diffInHours = Math.floor((now - addedAt) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just added';
    if (diffInHours < 24) return `Added ${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Added ${diffInDays}d ago`;
  };

  // Favorite Button Component (to be used in ad cards)
  const FavoriteButton = ({ ad, className = "" }) => {
    const isFavorited = isInFavorites(ad.id);
    
    const handleToggle = (e) => {
      e.stopPropagation(); // Prevent triggering card click
      if (isFavorited) {
        removeFromFavorites(ad.id);
      } else {
        addToFavorites(ad);
      }
    };

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`${className} ${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
      </Button>
    );
  };

  // Favorites List Component (for dashboard)
  const FavoritesList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
        <Badge variant="secondary">{favorites.length} saved ads</Badge>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600">Start browsing ads and save your favorites here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((ad) => (
            <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={getCategoryColor(ad.category)} size="sm">
                    {ad.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromFavorites(ad.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{ad.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {ad.location}
                  </div>
                  {ad.age && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {ad.age} years
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatTimeAgo(ad.addedAt)}</span>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {ad.views || 0} views
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return {
    FavoriteButton,
    FavoritesList,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    favorites
  };
};

export default FavoritesSystem;