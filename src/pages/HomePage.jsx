
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 hero-pattern">
    <div className="container mx-auto px-4 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-black to-red-600">
          Discover Malawi's Rich History
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Explore the cultural heritage, historical landmarks, and breathtaking places of the Warm Heart of Africa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/history">
              Explore History <Clock className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/places">
              Discover Places <MapPin className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-500 blur-3xl"
    />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ delay: 0.7, duration: 1 }}
      className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-red-500 blur-3xl"
    />
  </section>
);

const AboutMalawiSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">The Warm Heart of Africa</h2>
        <p className="text-lg text-gray-700">
          Malawi, known as "The Warm Heart of Africa," is a landlocked country in southeastern Africa.
          With a history spanning thousands of years, from ancient settlements to colonial rule and
          independence, Malawi's story is rich and diverse.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-green-50 rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-4">Rich History</h3>
          <p className="text-gray-700">
            From ancient Bantu settlements to the Maravi Kingdom, colonial rule, and independence,
            Malawi's history is a tapestry of resilience and cultural heritage.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-red-50 rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold mb-4">Cultural Heritage</h3>
          <p className="text-gray-700">
            Malawi's vibrant culture includes traditional dances like Gule Wamkulu, diverse languages,
            music, art, and cuisine that reflect its multicultural identity.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-black rounded-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-white">Breathtaking Places</h3>
          <p className="text-gray-300">
            From the crystal-clear waters of Lake Malawi to the majestic Mulanje Mountain and historic
            sites like Livingstonia, Malawi offers diverse and stunning landscapes.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const FeaturedPlaceCard = ({ place, variants }) => (
  <motion.div variants={variants} className="place-card">
    <Card className="h-full overflow-hidden border-none shadow-lg">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
      <img src={place.featured_image_url || "https://images.unsplash.com/photo-1595078548716-c39ee1764aba"} alt={place.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full">
          {place.category || 'Historical Site'}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold">{place.title}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{place.location || 'Malawi'}</span>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-3">
          {place.description}
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/places/${place.id}`}>
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const FeaturedPlacesSection = ({ places, containerVariants, itemVariants }) => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Places</h2>
        <p className="text-lg text-gray-700">
          Discover some of Malawi's most significant historical and natural sites that tell the story of this beautiful nation.
        </p>
      </motion.div>
      {places.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {places.map((place) => (
            <FeaturedPlaceCard key={place.id} place={place} variants={itemVariants} />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500">Loading featured places or no places to display.</p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12"
      >
        <Button asChild size="lg">
          <Link to="/places">
            View All Places <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

const CallToActionSection = () => (
  <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Journey Through Malawian History</h2>
        <p className="text-xl mb-8">
          Explore the events, people, and places that shaped the nation of Malawi.
        </p>
        <Button asChild size="lg" variant="outline" className="bg-white text-green-700 hover:bg-green-50 border-white">
          <Link to="/history">
            Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const { toast } = useToast();

  const fetchFeaturedPlaces = useCallback(async () => {
    if (!supabase) {
      toast({ title: "Supabase not available", description: "Using local data for featured places.", variant: "destructive" });
      setFeaturedPlaces([
        { id: 'local1', title: 'Lake Malawi National Park (Local)', description: 'A UNESCO World Heritage site, famous for its biodiversity.', category: 'Natural Wonder', location: 'Lake Malawi', featured_image_url: 'https://images.unsplash.com/photo-1595078548716-c39ee1764aba' },
        { id: 'local2', title: 'Livingstonia Mission (Local)', description: 'Historic mission station with stunning views and rich history.', category: 'Historical Site', location: 'Livingstonia', featured_image_url: 'https://images.unsplash.com/photo-1670496425913-f077d38a3971' },
        { id: 'local3', title: 'Chongoni Rock Art Area (Local)', description: 'UNESCO site with ancient rock paintings.', category: 'Cultural Site', location: 'Dedza', featured_image_url: 'https://images.unsplash.com/photo-1589904919890-7080050109f9' },
      ]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, description, categories(name), media(file_path), location_details') 
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const placesData = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.categories?.name || 'Uncategorized',
        location: item.location_details || 'Malawi', 
        featured_image_url: item.media?.find(m => m.file_path)?.file_path 
      }));
      setFeaturedPlaces(placesData);
    } catch (error) {
      toast({ title: "Error fetching featured places", description: error.message, variant: "destructive" });
      setFeaturedPlaces([
        { id: 'err1', title: 'Error Fetching Place 1', description: 'Please check connection.', category: 'Error', location: 'N/A', featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' },
      ]);
    }
  }, [toast]);

  useEffect(() => {
    fetchFeaturedPlaces();
  }, [fetchFeaturedPlaces]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <main>
      <HeroSection />
      <AboutMalawiSection />
      <FeaturedPlacesSection places={featuredPlaces} containerVariants={containerVariants} itemVariants={itemVariants} />
      <CallToActionSection />
    </main>
  );
};

export default HomePage;
