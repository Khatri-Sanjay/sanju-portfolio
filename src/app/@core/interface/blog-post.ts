export interface BlogPost {
  postId: string;  // Changed from 'id' to be more specific
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: number;
  publishDate: Date;
  likes: number;
  comments: BlogComment[];  // Renamed from Comment to BlogComment to avoid conflicts
}

export interface Author {
  authorId: string;  // Changed from 'id' to be more specific
  name: string;
  avatar: string;
  bio: string;
}

export interface BlogComment {  // Renamed from Comment to BlogComment
  commentId: string;  // Changed from 'id' to be more specific
  content: string;
  author: Author;
  date: Date;
  likes: number;
}
