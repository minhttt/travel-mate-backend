export interface BlogResponse {
  blogid: number;
  title: string;
  idusercreate: number;
  user?: {
    name: string;
    avatar: string;
  };
  blogImages?: {
    imageUrl: string;
  }[];
}
