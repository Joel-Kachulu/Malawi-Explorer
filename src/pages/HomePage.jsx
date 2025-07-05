import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { usePageTracking } from '@/hooks/useAnalytics';

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
          stay Ahead with the Latest Tech News
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Get real-time updates on innovation, gadgets, startups, and industry trends shaping the future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/history">
              Find out Malawi's Tech Revolution <Clock className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/places">
              Browse Latest Tech News <MapPin className="ml-2 h-5 w-5" />
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
          Welcome to your hub for cutting-edge tech insights. From global breakthroughs to local startup stories, we bring you the future, one article at a time.
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
          <h3 className="text-xl font-bold mb-4">Trending Innovations</h3>
          <p className="text-gray-700">
           Explore the latest breakthroughs in AI, blockchain, and digital tools shaping Malawi's future.
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
          <h3 className="text-xl font-bold mb-4">Tech Culture</h3>
          <p className="text-gray-700">
             Explore the impact of technology on our lives, from productivity tools to ethical dilemmas.
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
          <h3 className="text-xl font-bold mb-4 text-white">Startups & Ecosystems</h3>
          <p className="text-gray-300">
            Discover emerging tech hubs, promising startups, and how they're changing the business landscape.
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
          {place.category || 'automation'}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold">{place.title}</h3>
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
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Tech Stories</h2>
        <p className="text-lg text-gray-700">
         Handpicked news that matter: key product launches, insightful analysis, and tech breakthroughs redefining tomorrow.
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
        <p className="text-center text-gray-500">Loading featured tech stories or no stories to display.</p>
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
            View All Stories <ArrowRight className="ml-2 h-5 w-5" />
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
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Tech Journey Today</h2>
        <p className="text-xl mb-8">
           Don't miss out on the latest trends, tools, and ideas that will shape the next decade..
        </p>
        <Button asChild size="lg" variant="outline" className="bg-white text-green-700 hover:bg-green-50 border-white">
          <Link to="/history">
            Read News <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const { toast } = useToast();
  const { trackPageView } = usePageTracking();

  // Track page view on component mount
  useEffect(() => {
    trackPageView('/', 'Malawi Tech Explorer - Home');
  }, [trackPageView]);

  const fetchFeaturedPlaces = useCallback(async () => {
    if (!supabase) {
      toast({ title: "Supabase not available", description: "Using local data for featured articles.", variant: "destructive" });
      setFeaturedPlaces([
        {
          id: 'local1',
          title: 'AI Revolution: What\'s Next for Developers',
          description: 'A deep dive into the tools and trends redefining the way software is built.',
          category: 'Artificial Intelligence',
          featured_image_url: 'https://images.unsplash.com/photo-1581093588401-4bfa4b30c527',
        },
        {
          id: 'local2',
          title: 'Africa\'s Rising Startup Ecosystem',
          description: 'How young tech entrepreneurs are reshaping economies across the continent.',
          category: 'Startups',
          featured_image_url: 'https://images.unsplash.com/photo-1603570417831-38cbe6c4e9ed',
        },
        {
          id: 'local3',
          title: '5G and Beyond: The Next-Gen Networks',
          description: 'The technologies that will power the internet of the future.',
          category: 'Telecom',
          featured_image_url: 'https://images.unsplash.com/photo-1559027615-5e247fbb4c64',
        },
      ]);
      
      return;
    }
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, description, categories(name), media(file_path)') 
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      const placesData = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.categories?.name || 'Uncategorized',
        featured_image_url: item.media?.find(m => m.file_path)?.file_path 
      }));
      setFeaturedPlaces(placesData);
    } catch (error) {
      toast({ title: "Error fetching featured articles", description: error.message, variant: "destructive" });
      setFeaturedPlaces([
        { id: 'err1', title: 'Error Fetching article 1', description: 'Please check connection.', category: 'Error', featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' },
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
