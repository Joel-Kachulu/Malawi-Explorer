import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define toolbar options for the rich text editor
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
    ['blockquote', 'code-block'],
    [{ 'align': [] }],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
  'color', 'background',
  'blockquote', 'code-block',
  'align'
];

const ArticleFormModal = ({ isOpen, onClose, onSubmit, article }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    publish_date: '',
    tags: '',
    category_id: '',
    image_file: null,
    video_url: ''
  });
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!supabase) return;
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase.from('categories').select('id, name').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({ title: "Error fetching categories", description: error.message, variant: "destructive" });
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (article) {
        setFormData({
          title: article.title || '',
          description: article.description || '',
          content: article.content || '',
          publish_date: article.publish_date || new Date().toISOString().split('T')[0],
          tags: article.tags ? article.tags.join(', ') : '',
          category_id: article.category_id || '',
          image_file: null,
          video_url: article.video_url || ''
        });
        setPreviewImage(article.featured_image_url || null);
      } else {
        setFormData({
          title: '',
          description: '',
          content: '',
          publish_date: new Date().toISOString().split('T')[0],
          tags: '',
          category_id: '',
          image_file: null,
          video_url: ''
        });
        setPreviewImage(null);
      }
    }
  }, [isOpen, article, fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image_file: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({...prev, image_file: null}));
      setPreviewImage(article?.featured_image_url || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setPreviewImage(null); } onClose(); }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'Add New Article'}</DialogTitle>
          <DialogDescription>
            {article ? 'Update the details of the historical article.' : 'Fill in the details for the new historical article.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
          </div>
          <div className="grid gap-4">
            <Label htmlFor="content">Content</Label>
            <div className="rounded-md border border-input bg-background">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your article content here..."
                className="h-60"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="publish_date">Publish Date</Label>
              <Input id="publish_date" name="publish_date" type="date" value={formData.publish_date} onChange={handleInputChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                disabled={isLoadingCategories}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {isLoadingCategories && <p className="text-xs text-gray-500">Loading categories...</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image_file">Featured Image</Label>
            {previewImage && (
              <div className="my-2">
                <img src={previewImage} alt="Preview" className="max-h-40 rounded-md object-contain" />
              </div>
            )}
            <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              </div>
              <Input id="image-upload" name="image_file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
            {formData.image_file && <p className="text-sm text-gray-500 mt-1">New file: {formData.image_file.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video_url">Video URL</Label>
            <Input id="video_url" name="video_url" value={formData.video_url} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=example" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setPreviewImage(null); onClose(); }}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            {article ? 'Save Changes' : 'Add Article'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormModal;
