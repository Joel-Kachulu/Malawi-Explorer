
import { supabase } from '@/supabaseClient';

export const handleArticleSubmit = async (formData, currentArticle, supabaseInstance, toast, callback) => {
  if (!supabaseInstance) {
    toast({ title: "Supabase Client Not Available", description: "Cannot save data.", variant: "destructive" });
    return;
  }
  
  const { image_file, ...articleFields } = formData;
  const BUCKET_NAME = 'article-media';

  const articleData = {
    title: articleFields.title,
    description: articleFields.description,
    content: articleFields.content || '',
    publish_date: articleFields.publish_date,
    tags: articleFields.tags ? articleFields.tags.split(',').map(tag => tag.trim()) : [],
    category_id: articleFields.category_id,
    location_details: articleFields.location_details || '',
    video_url: articleFields.video_url || '',
  };

  try {
    const { data: { user } } = await supabaseInstance.auth.getUser();
    if (user) {
      articleData.author_id = user.id;
    } else {
      toast({ title: "Authentication Error", description: "User not found. Please log in again.", variant: "destructive" });
      return;
    }

    let articleResponse;
    if (currentArticle) {
      const { data, error } = await supabaseInstance.from('articles').update(articleData).eq('id', currentArticle.id).select().single();
      if (error) throw error;
      articleResponse = data;
      toast({ title: "Article Updated", description: `${articleData.title} has been updated.` });
    } else {
      const { data, error } = await supabaseInstance.from('articles').insert(articleData).select().single();
      if (error) throw error;
      articleResponse = data;
      toast({ title: "Article Added", description: `${articleData.title} has been added.` });
    }

    if (image_file && articleResponse) {
      const fileExt = image_file.name.split('.').pop();
      const fileName = `${user.id}/${articleResponse.id}-${Date.now()}.${fileExt}`; 
      const filePathInBucket = `${fileName}`;

      const { error: uploadError } = await supabaseInstance.storage.from(BUCKET_NAME).upload(filePathInBucket, image_file);
      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
           toast({ title: "Storage Error", description: `The '${BUCKET_NAME}' bucket was not found. Please ensure it's created in your Supabase project.`, variant: "destructive" });
        } else {
          throw uploadError;
        }
        return; 
      }
      
      const { data: publicUrlData } = supabaseInstance.storage.from(BUCKET_NAME).getPublicUrl(filePathInBucket);
      const publicURL = publicUrlData.publicUrl;
      
      const mediaData = {
        article_id: articleResponse.id,
        file_name: image_file.name,
        file_path: publicURL, 
        mime_type: image_file.type,
        size_bytes: image_file.size,
        type: 'image',
        author_id: user.id, 
      };

      const { error: mediaError } = await supabaseInstance.from('media').insert(mediaData);
      if (mediaError) {
        toast({ title: "Error saving media record", description: mediaError.message, variant: "destructive" });
      }
    }
    
    if (callback) callback();
  } catch (error) {
    toast({
      title: `Error ${currentArticle ? 'Updating' : 'Adding'} Article`,
      description: error.message,
      variant: "destructive",
    });
  }
};

export const deleteArticle = async (articleId, articleTitle, supabaseInstance, toast, callback) => {
   if (!supabaseInstance) {
    toast({ title: "Supabase Client Not Available", description: "Cannot delete data.", variant: "destructive" });
    return;
  }
  const BUCKET_NAME = 'article-media';
  try {
    const { data: mediaItems, error: mediaFetchError } = await supabaseInstance
      .from('media')
      .select('file_path') 
      .eq('article_id', articleId);

    if (mediaFetchError) {
      console.warn("Could not fetch media items for deletion:", mediaFetchError.message);
    }

    const { error: articleDeleteError } = await supabaseInstance.from('articles').delete().eq('id', articleId);
    if (articleDeleteError) throw articleDeleteError;

    if (mediaItems && mediaItems.length > 0) {
      const filesToDelete = mediaItems.map(item => {
        try {
          const url = new URL(item.file_path);
          const pathParts = url.pathname.split('/');
          return pathParts.slice(pathParts.indexOf(BUCKET_NAME) + 1).join('/');
        } catch (e) {
          console.error("Error parsing media file_path for storage deletion:", item.file_path, e);
          return null;
        }
      }).filter(path => path !== null);

      if (filesToDelete.length > 0) {
        const { data: deleteData, error: storageDeleteError } = await supabaseInstance.storage
          .from(BUCKET_NAME)
          .remove(filesToDelete);
        
        if (storageDeleteError) {
          console.warn("Error deleting files from storage:", storageDeleteError.message);
          toast({ title: "Storage Cleanup Warning", description: "Article deleted, but some associated files might not have been removed from storage. " + storageDeleteError.message, variant: "warning", duration: 7000 });
        } else {
          toast({ title: "Article & Media Deleted", description: `"${articleTitle}" and its associated files have been deleted.`, variant: "default" });
        }
      } else {
         toast({ title: "Article Deleted", description: `"${articleTitle}" has been deleted. No storage files found to remove or paths were invalid.`, variant: "default" });
      }
    } else {
       toast({ title: "Article Deleted", description: `"${articleTitle}" has been deleted. No associated media records found.`, variant: "default" });
    }
    
    if (callback) callback(); 
  } catch (error) {
    toast({
      title: "Error Deleting Article",
      description: error.message,
      variant: "destructive",
    });
  }
};
