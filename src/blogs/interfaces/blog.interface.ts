export interface BlogResponse {
  blogid: number;
  title: string;
  idusercreate: number;
  tripid: number;
  user?: {
    name: string;
    avatar: string;
  };
  blogImages?: {
    imageUrl: string;
  }[];
}
