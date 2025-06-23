// PlaceDetailPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, ArrowLeft, Info, Image as ImageIcon, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlaceDetails = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({
        title: "Supabase not available",
        description: "Cannot fetch place details.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          description,
          content,
          publish_date,
          tags,
          categories (name),
          media (file_path, type, caption)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Place not found");

      setPlace({
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        publish_date: data.publish_date,
        tags: data.tags || [],
        category: data.categories?.name || 'Uncategorized',
        images: data.media?.filter(m => m.type === 'image').map(m => ({
          url: m.file_path,
          caption: m.caption,
        })) || [],
        videos: data.media?.filter(m => m.type === 'video_url').map(m => ({
          url: m.file_path,
          caption: m.caption,
        })) || [],
      });
    } catch (error) {
      toast({
        title: "Error fetching blog details",
        description: error.message,
        variant: "destructive",
      });
      setPlace(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [fetchPlaceDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <Info size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Blogs Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Sorry, we couldn't find the details for this blogs. It might have been removed or the link is incorrect.
        </p>
        <Button asChild>
          <Link to="/places">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  const mainImage = place.images.length > 0
    ? place.images[0].url
    : "https://images.unsplash.com/photo-1500382017468-9049fed747ef";

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[400px]">
        <img
          src={mainImage}
          alt={place.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Floating Content on the Left */}
        <div className="absolute bottom-6 left-6 z-20 max-w-md space-y-3 text-white">
          <Button asChild variant="secondary" className="bg-white/80 hover:bg-white text-black">
            <Link to="/places">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>
          </Button>
          
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            {place.category}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="rounded-2xl shadow-md mb-10">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">About {place.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-gray-700">
              {place.content ? (
                <div dangerouslySetInnerHTML={{ __html: place.content.replace(/\n/g, '<br />') }} />
              ) : (
                <p>No detailed content available for this place yet.</p>
              )}
            </CardContent>
          </Card>

          {place.images.length > 1 && (
            <Card className="rounded-2xl shadow-md mb-10">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <ImageIcon className="mr-2 text-green-600" /> Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {place.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden shadow aspect-square"
                    >
                      <img
                        src={image.url}
                        alt={image.caption || `Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {image.caption && (
                        <p className="text-xs text-center p-1 bg-gray-50">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {place.videos.length > 0 && (
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <Video className="mr-2 text-red-600" /> Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {place.videos.map((video, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md">
                      <div className="aspect-video bg-black">
                        {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.url.split('v=')[1]?.split('&')[0] || video.url.split('/').pop()}`}
                            title={video.caption || `Video ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video controls className="w-full h-full">
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                      {video.caption && (
                        <p className="text-sm text-center p-2 bg-gray-100">{video.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default PlaceDetailPage;
