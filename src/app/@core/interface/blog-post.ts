export interface BlogPost {
  postId: string;  // Changed from 'id' to be more specific
  title: string;
  description: string;
  detailDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  excerpt?: string;
  author?: Author;
  imageUrl?: string;
  readTime?: number;
  likes?: number;
  comments?: BlogComment[];  // Renamed from Comment to BlogComment to avoid conflicts
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
  author?: Author;
  date: Date;
  likes: number;
}
