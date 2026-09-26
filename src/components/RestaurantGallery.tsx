const photos = [
  { src: '/restaurant/exterior.jpg', alt: 'Your Choice family Restaurant exterior' },
  { src: '/restaurant/chef.jpg', alt: 'Chef preparing food in the kitchen' },
  { src: '/restaurant/dining.jpg', alt: 'Colourful restaurant dining area' },
  { src: '/restaurant/display.png', alt: 'Restaurant beverage and service display' },
];

export function RestaurantGallery() {
  return (
    <section className="container gallery-section" aria-label="Restaurant photos">
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <img key={photo.src} className={index === 0 ? 'gallery-main' : ''} src={photo.src} alt={photo.alt} loading="lazy" />
        ))}
      </div>
    </section>
  );
}
