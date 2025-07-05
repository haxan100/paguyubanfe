import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, Send, Camera, X, Trash2, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';
import { apiRequest } from '../utils/api';

interface Post {
  id: number;
  user_id: number;
  konten: string;
  foto: string | null;
  nama: string;
  blok: string;
  tanggal_post: string;
  total_likes: number;
  total_comments: number;
}

interface Comment {
  id: number;
  komentar: string;
  nama: string;
  blok: string;
  tanggal_komentar: string;
}

export default function InfoWarga() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [comments, setComments] = useState<{[key: number]: Comment[]}>({});
  const [newComment, setNewComment] = useState<{[key: number]: string}>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiRequest('/api/posts');
      const result = await response.json();
      if (result.status === 'success') {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !foto) return;

    try {
      const formData = new FormData();
      formData.append('konten', newPost);
      
      if (foto) {
        formData.append('foto', foto);
      }

      const response = await apiRequest('/api/posts', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.status === 'success') {
        setNewPost('');
        setFoto(null);
        fetchPosts();
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Post berhasil dibuat',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal membuat post'
      });
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await apiRequest(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const toggleComments = async (postId: number) => {
    if (!showComments[postId]) {
      try {
        const response = await apiRequest(`/api/posts/${postId}/comments`);
        const result = await response.json();
        if (result.status === 'success') {
          setComments(prev => ({ ...prev, [postId]: result.data }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: number) => {
    const comment = newComment[postId]?.trim();
    if (!comment) return;

    try {
      const response = await apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ komentar: comment })
      });

      if (response.ok) {
        setNewComment(prev => ({ ...prev, [postId]: '' }));
        toggleComments(postId); // Refresh comments
        fetchPosts(); // Update comment count
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    const result = await Swal.fire({
      title: 'Hapus Post?',
      text: 'Post yang dihapus tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiRequest(`/api/posts/${postId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.status === 'success') {
          fetchPosts();
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Post berhasil dihapus',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus post'
        });
      }
    }
  };

  const canDeletePost = (post: Post) => {
    if (!user) return false;
    return ['admin', 'ketua', 'koordinator_perblok'].includes(user.jenis) || 
           post.user_id === user.id;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Info Warga</h2>
      
      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Apa yang ingin Anda bagikan?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
          
          {foto && (
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(foto)}
                alt="Preview"
                className="w-32 h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFoto(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-blue-600 cursor-pointer">
              <Camera size={20} />
              <span>Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            
            <button
              type="submit"
              disabled={!newPost.trim() && !foto}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={16} />
              <span>Posting</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{post.nama.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{post.nama}</h3>
                  <p className="text-sm text-gray-500">Blok {post.blok} • {new Date(post.tanggal_post).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              
              {canDeletePost(post) && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Hapus post"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Content */}
            <p className="text-gray-700 dark:text-gray-300 mb-3">{post.konten}</p>
            
            {/* Photo */}
            {post.foto && (
              <img
                src={`/assets/uploads/${post.foto}`}
                alt="Post"
                className="w-full max-h-96 object-cover rounded-lg mb-3 cursor-pointer"
                onClick={() => window.open(`/assets/uploads/${post.foto}`, '_blank')}
              />
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
              >
                <Heart size={20} />
                <span>{post.total_likes}</span>
              </button>
              
              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
              >
                <MessageCircle size={20} />
                <span>{post.total_comments}</span>
              </button>
            </div>

            {/* Comments */}
            {showComments[post.id] && (
              <div className="mt-4 space-y-3">
                {comments[post.id]?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.nama}</span>
                      <span className="text-xs text-gray-500">Blok {comment.blok}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.komentar}</p>
                  </div>
                ))}
                
                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment[post.id] || ''}
                    onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Tulis komentar..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}