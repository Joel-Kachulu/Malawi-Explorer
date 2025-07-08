import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UploadCloud, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';
import ImageResizeModule from './ImageResizeModule';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Enhanced toolbar configuration with comprehensive formatting options
const modules = {
  toolbar: [
    // Text formatting
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    
    // Text styling
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    
    // Text alignment and indentation
    [{ 'align': [] }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    
    // Lists and formatting
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    
    // Special formatting
    ['blockquote', 'code-block'],
    
    // Links and media
    ['link', 'image', 'video'],
    
    // Clean formatting
    ['clean']
  ],
  
  // Keyboard shortcuts
  keyboard: {
    bindings: {
      tab: {
        key: 9,
        handler: function() {
          return true;
        }
      }
    }
  },
  
  // Clipboard handling
  clipboard: {
    matchVisual: false,
  },
  
  // History for undo/redo
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true
  }
};

// Comprehensive formats array
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'script',
  'align', 'indent', 'direction',
  'list', 'bullet',
  'blockquote', 'code-block',
  'link', 'image', 'video',
  'clean'
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
  const [isEditorFullScreen, setIsEditorFullScreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [quillInstance, setQuillInstance] = useState(null);

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

  // Initialize image resize module when Quill instance is available
  useEffect(() => {
    if (quillInstance) {
      new ImageResizeModule(quillInstance);
    }
  }, [quillInstance]);

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
      setFormData(prev => ({ ...prev, image_file: null }));
      setPreviewImage(article?.featured_image_url || null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setPreviewImage(null); } onClose(); }}>
      <DialogContent className={`${isEditorFullScreen ? 'max-w-[95vw] max-h-[95vh]' : 'sm:max-w-[800px]'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{article ? 'Edit Article' : 'Add New Article'}</DialogTitle>
          <DialogDescription>
            Create or edit your article with our enhanced rich text editor
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

          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Content</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <><EyeOff className="mr-1 h-4 w-4" /> Hide Preview</> : <><Eye className="mr-1 h-4 w-4" /> Show Preview</>}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditorFullScreen(!isEditorFullScreen)}
                >
                  {isEditorFullScreen ? <><Minimize2 className="mr-1 h-4 w-4" /> Collapse</> : <><Maximize2 className="mr-1 h-4 w-4" /> Fullscreen</>}
                </Button>
              </div>
            </div>
            
            {showPreview ? (
              <div className="border rounded-md p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </div>
            ) : (
              <div className={`rich-text-editor ${isEditorFullScreen ? 'fullscreen' : ''}`}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your article content here... Use the toolbar above for rich formatting options including headers, lists, links, images, tables, and more!"
                  className={`${isEditorFullScreen ? 'h-[80vh]' : 'h-80'} ${showPreview ? 'hidden' : ''}`}
                  onEditorReady={(quill) => setQuillInstance(quill)}
                />
                {isEditorFullScreen && (
                  <div className="mt-4 flex justify-end p-4 bg-white border-t">
                    <Button onClick={() => setIsEditorFullScreen(false)}>Close Fullscreen</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input 
              id="tags" 
              name="tags" 
              value={formData.tags} 
              onChange={handleInputChange} 
              placeholder="tech, malawi, innovation, startup"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image_file">Featured Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image_file"
                name="image_file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              {previewImage && (
                <div className="w-20 h-20 border rounded overflow-hidden">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="video_url">Video URL (optional)</Label>
            <Input 
              id="video_url" 
              name="video_url" 
              value={formData.video_url} 
              onChange={handleInputChange} 
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {article ? 'Update Article' : 'Create Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormModal;
