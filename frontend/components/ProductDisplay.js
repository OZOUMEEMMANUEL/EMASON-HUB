import React, { useState } from 'react';
import './ProductDisplay.css'; // Import the CSS file for styling

const ProductDisplay = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleSizeChange = (event) => {
    const newSize = product.sizes.find(size => size.size === event.target.value);
    setSelectedSize(newSize);
  };

  return (
    <div className="product-display">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-details">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <select onChange={handleSizeChange} className="product-size-select">
          {product.sizes.map(size => (
            <option key={size.size} value={size.size}>
              {size.size}
            </option>
          ))}
        </select>
        <p className="product-price">Price: ₦{selectedSize.price}</p>
      </div>
    </div>
  );
};

export default ProductDisplay;
