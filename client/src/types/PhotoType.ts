type PhotoType = {
  id: number;
  title: string;
  content: string;
  artist: string;
  dateoftheday: string;
  latitude: number;
  longitude: number;
  picture: File | null;
  user_id: number;
};

export default PhotoType;
