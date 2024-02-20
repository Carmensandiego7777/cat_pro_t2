import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './category.css';

function CategoryComponent() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            //const response = await fetch('https://server-v34z.onrender.com/api/categories');
            const response = await fetch('https://localhost:9200/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <div>
            <h2 className="mb-4 font-weight-bold text-primary font-sans-serif">CATEGORIES</h2>
            <table className='table table-striped' style={{ tableLayout: 'fixed', width: '100%' }}>
  <thead className='thead-dark'>
    <tr>
      <th>CategoryID</th>
      <th>CategoryName</th>
      <th>Stock</th>
      <th>CreatedDate</th>    
    </tr>
  </thead>
  <tbody>
    {categories.map(category => (
      <tr key={category.CategoryId}>
        <td>{category.CategoryId}</td>
        <td>
          <Link to={`/product/cid=${category.CategoryId}/pg-1`}>
            {category.CategoryName}
          </Link>
        </td>
        <td>{category.Stock}</td>
        <td>{new Date(category.CreatedDate).toLocaleDateString()}</td>
      </tr>
    ))}
  </tbody>
</table>

<div>
  <Link to="/product" className="btn btn-primary">
    All Products
  </Link>
</div>

        </div>
    );
}

export default CategoryComponent;
