import React, { useState, useEffect } from 'react';
import './css/Products.css'

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: ''


  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:6969/registry');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const response = await fetch('http://localhost:6969/registry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    const addedProduct = await response.json();
    setProducts([...products, addedProduct]);
    setNewProduct({ name: '' });
  };

  const handleEditProduct = async (id) => {
    const response = await fetch(`http://localhost:6969/registry/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProduct),
    });
    const updatedProduct = await response.json();
    setProducts(products.map(product => (product.id === id ? updatedProduct : product)));
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{editingProduct && editingProduct.id === product.id ? (
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              ) : (
                product.name
              )}</td>
              <td>
                {editingProduct && editingProduct.id === product.id ? (
                  <button onClick={() => handleEditProduct(product.id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => setEditingProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="text"
        value={newProduct.name}
        onChange={(e) => setNewProduct({
          name: e.target.value 
          
        })}
        placeholder="New Product Name"
      />
      <button onClick={handleAddProduct}>Add Product</button>
    </div>
  );
}

export default Products;
