import React, { useState } from 'react';

const ProductDisplay = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleSizeChange = (event) => {
    const newSize = product.sizes.find(size => size.size === event.target.value);
    setSelectedSize(newSize);
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <select onChange={handleSizeChange}>
        {product.sizes.map(size => (
          <option key={size.size} value={size.size}>
            {size.size}
          </option>
        ))}
      </select>
      <p>Price: ${selectedSize.price}</p>
      {/* ...existing code... */}
    </div>
  );
};

export default ProductDisplay;
