export type ModalTypes = 'info' | 'confirm' | 'detail' | 'gallery';

export interface DetailModalContent {
  title: string;
  items: Array<{
    label: string;
    value: string | React.ReactNode | JSX.Element;
    span?: number;
  }>;
}

export interface GalleryModalContent {
  images: any[];
  currentIndex?: number;
}

export interface ModalOptions {
  type: ModalTypes;
  content: string | JSX.Element | DetailModalContent[] | GalleryModalContent;
  onOk?: () => void;
  onCancel?: () => void;
}