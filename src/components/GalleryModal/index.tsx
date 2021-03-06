// base
import React, { useEffect, useRef, useCallback } from 'react';

// modules
import { Modal, Carousel, Icon } from 'antd';

// types
import { ModalOptions, GalleryModalContent } from 'models';

// assets
import './index.less';
import { getThumbUrl } from 'lib/utils';

interface Props extends ModalOptions {
  content: GalleryModalContent;
  visible: boolean;
}

function GalleryModal(props: Props) {
  const { content } = props;
  const { images, currentIndex } = content;
  const carouselRef = useRef<Carousel>(null);

  const handlePrev = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  }, [carouselRef]);

  const handleNext = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  }, [carouselRef]);

  const goTo = useCallback(
    (index: number) => {
      if (carouselRef.current) {
        carouselRef.current.goTo(index);
      }
    },
    [carouselRef],
  );

  useEffect(() => {
    if (typeof currentIndex === 'number') {
      if (carouselRef.current) {
        goTo(currentIndex);
      } else {
        setTimeout(() => {
          goTo(currentIndex);
        }, 100);
      }
    }
  }, [currentIndex, carouselRef.current, goTo]);

  return (
    <Modal {...props} wrapClassName="modal-gallery" footer={null}>
      <Carousel ref={carouselRef}>
        {images.map((image, i) => (
          <div key={image.fileKey}>
            <div
              className="image-container"
              style={{
                backgroundImage: `url(${getThumbUrl(image.fileKey, 520, 520, 'scale')})`,
              }}
            />
          </div>
        ))}
      </Carousel>
      <Icon type="left" onClick={handlePrev} className="carousel-btn prev" />
      <Icon type="right" onClick={handleNext} className="carousel-btn next" />
    </Modal>
  );
}

export default GalleryModal;
