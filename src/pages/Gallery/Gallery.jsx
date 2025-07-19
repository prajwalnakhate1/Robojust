import React from 'react';

const images = [
  {
    src: 'https://via.placeholder.com/300x200?text=Arduino+Uno',
    name: 'Arduino Uno',
  },
  {
    src: 'https://via.placeholder.com/300x200?text=Raspberry+Pi',
    name: 'Raspberry Pi',
  },
  {
    src: 'https://via.placeholder.com/300x200?text=ESP32+Module',
    name: 'ESP32 Module',
  },
  {
    src: 'https://via.placeholder.com/300x200?text=Sensor+Module',
    name: 'Sensor Module',
  },
];

const Gallery = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Products</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <li key={index} className="rounded overflow-hidden shadow-lg">
            <img
              src={image.src}
              alt={image.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
            />
            <div className="p-4 text-center font-medium">{image.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Gallery;
