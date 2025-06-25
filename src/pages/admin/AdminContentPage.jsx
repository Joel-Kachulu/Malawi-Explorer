import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ArticleFormModal from '@/components/admin/content/ArticleFormModal';
import ArticleTable from '@/components/admin/content/ArticleTable';
import { supabase } from '@/supabaseClient';
import { handleArticleSubmit, deleteArticle } from '@/lib/adminContentManager';

const AdminContentHeader = ({ onAddNew }) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    <h1 className="text-3xl font-bold text-gray-800">Manage Content</h1>
    <Button onClick={onAddNew} className="bg-green-600 hover:bg-green-700">
      <PlusCircle className="mr-2 h-5 w-5" /> Add New Article
    </Button>
  </div>
);

const ArticleSearchAndFilter = ({ searchTerm, onSearchTermChange }) => (
  <div className="mt-4 flex flex-col md:flex-row gap-4">
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="w-full pl-10"
      />
    </div>
    <Button variant="outline">
      <Filter className="mr-2 h-4 w-4" /> Filters
    </Button>
  </div>
);

const AdminContentPage = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({
        title: "Supabase Client Not Available",
        description: "Cannot fetch articles. Please check Supabase connection.",
        variant: "destructive",
      });
      setIsLoading(false);
      setArticles([]);
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
          category_id, 
          categories (name),
          media (id, file_path, type, file_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedArticles = data.map(article => ({
        ...article,
        category: article.categories ? article.categories.name : 'Uncategorized',
        featured_image_url: article.media?.find(m => m.type === 'image')?.file_path,
      }));
      setArticles(formattedArticles);

    } catch (error) {
      toast({
        title: "Error Fetching Articles",
        description: error.message,
        variant: "destructive",
      });
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (article.category && article.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
  );

   // Add this right before: const onDeleteArticle = async ...
const onFormSubmit = async (formData) => {
  await handleArticleSubmit(formData, currentArticle, supabase, toast, () => {
    fetchArticles();
    setIsModalOpen(false);
    setCurrentArticle(null);
  });
};


  const onDeleteArticle = async (articleId, articleTitle) => {
    await deleteArticle(articleId, articleTitle, supabase, toast, fetchArticles);
  };

  const openModal = (article = null) => {
    setCurrentArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminContentHeader onAddNew={() => openModal()} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Historical Articles</CardTitle>
          <CardDescription>View, edit, or delete historical articles.</CardDescription>
          <ArticleSearchAndFilter searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <ArticleTable
              articles={filteredArticles}
              onEdit={openModal}
              onDelete={onDeleteArticle}
            />
          )}
        </CardContent>
      </Card>

      <ArticleFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentArticle(null);
        }}
        onSubmit={onFormSubmit}
        article={currentArticle}
      />
    </div>
  );
};

export default AdminContentPage;
