import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import MapView from './MapView';

const PlaceCard = ({ place, variants }) => (
  <motion.div variants={variants} className="place-card">
    <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="h-56 bg-gray-200 relative overflow-hidden">
        <img 
          src={place.featured_image_url || "https://images.unsplash.com/photo-1670496425913-f077d38a3971"} 
          alt={place.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
          {place.category || 'Historical Site'}
        </div>
      </div>
      <CardContent className="p-6 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-2">{place.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{place.location || 'Malawi'}</span>
          </div>
          <p className="text-gray-700 mb-4 line-clamp-3">
            {place.description}
          </p>
        </div>
        <Button asChild variant="outline" className="w-full mt-auto">
          <Link to={`/places/${place.id}`}>
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const PlacesPage = () => {
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlacesAndCategories = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({ title: "Supabase not available", description: "Cannot fetch places.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, description, categories(id, name), media(file_path))
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      const placesData = articlesData.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category_id: item.categories?.id,
        category: item.categories?.name || 'Uncategorized',
        featured_image_url: item.media?.find(m => m.file_path)?.file_path
      }));
      setAllPlaces(placesData);
      setFilteredPlaces(placesData);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(['All', ...categoriesData.map(cat => cat.name)]);

    } catch (error) {
      toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPlacesAndCategories();
  }, [fetchPlacesAndCategories]);

  useEffect(() => {
    let currentPlaces = [...allPlaces];
    if (selectedCategory !== 'All') {
      currentPlaces = currentPlaces.filter(place => place.category === selectedCategory);
    }
    if (searchTerm) {
      currentPlaces = currentPlaces.filter(place =>
        place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPlaces(currentPlaces);
  }, [searchTerm, selectedCategory, allPlaces]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Malawi Tech</h1>
            <p className="text-xl opacity-90">
              Discover historical sites, natural wonders, and cultural landmarks that tell the story of Malawi.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search places by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredPlaces.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} variants={itemVariants} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No blogs found</h3>
              <p className="text-gray-500 mb-8">Try adjusting your search or filter criteria.</p>
              <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    
    
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Malawi Map</h2>
          <p className="text-gray-700">
            Explore the geographical distribution of historical and cultural sites across Malawi.
          </p>
        </div>
        <MapView />
      </div>
    </section>
    
    </main>
  );
};

export default PlacesPage;
