import React, { useState, useEffect, useRef } from 'react'

function ProductImgList({ images }) {
  const [modalImg, setModalImg] = useState(null)
  const scrollRef = useRef()

  //이미지 스크롤
  const scrollLeft = () => {
    if (images.length > 3) {
      scrollRef.current.scrollBy({
        left: -150,
        behavior: 'smooth',
      })
    }
  }
  const scrollRight = () => {
    if (images.length > 3) {
      scrollRef.current.scrollBy({
        left: 150,
        behavior: 'smooth',
      })
    }
  }
  console.log('images 전체 확인:', images)
  return (
    <div className="image-scroll-wrapper">
      <button type="button" onClick={scrollLeft}>
        &lt;
      </button>
      <div className="image-scroll-container" ref={scrollRef}>
        {Array.isArray(images) && images.length > 0 ? (
          images.map((img, index) => {
            // 썸네일: imageType 200, 400 / 상세: 300
            const isThumbnail = img.imageType === '200' || img.imageType === '400'
            const imgSrc = isThumbnail
              ? `/static/images/thumbnail/${img.imageName}`
              : `/static/images/detailimages/${img.imageName}`
            const noImgSrc = isThumbnail
              ? '/static/images/thumbnail/no-image.png'
              : '/static/images/detailimages/no-image.png'
            return (
              <div key={index} className="image-box" onClick={() => setModalImg(img)}>
                <img
                  src={imgSrc}
                  alt="상품이미지"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = noImgSrc
                  }}
                />
              </div>
            )
          })
        ) : (
          <p className="no-image-text">이미지가 없습니다</p>
        )}
      </div>
      <button type="button" onClick={scrollRight}>
        &gt;
      </button>

      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          {(() => {
            const isThumbnail = modalImg.imageType === '200' || modalImg.imageType === '400'
            const imgSrc = isThumbnail
              ? `/static/images/thumbnail/${modalImg.imageName}`
              : `/static/images/detailimages/${modalImg.imageName}`
            const noImgSrc = isThumbnail
              ? '/static/images/thumbnail/no-image.png'
              : '/static/images/detailimages/no-image.png'
            return (
              <img
                className="modal-image"
                src={imgSrc}
                alt="확대 이미지"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = noImgSrc
                }}
              />
            )
          })()}
          <button className="close-btn" onClick={() => setModalImg(null)}>
            X
          </button>
        </div>
      )}
    </div>
  )
}
export default ProductImgList
