export interface Image {
  src?: string;
  width?: number;
  height?: number;
  suffix?: string;
  ratio?: string;
  media?: {
    mediaId?: string;
    name?: string;
    width?: number;
    height?: number;
  };
  gravity?: {
    mode?: string;
    coordinates?: { x?: number; y?: number };
  };
  title?: string;
}
