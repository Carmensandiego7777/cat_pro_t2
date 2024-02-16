import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoryComponent from './pages/category.jsx';
import ProductComponent from './pages/product.jsx'; // Import ProductComponent

function App() {
  const [count, setCount] = useState(1)
  const [searchValue, setSearchValue] = useState('');

  

  return (
    <div className="App">
      
      <Router>
        <Routes>
        <Route path="/" element={<CategoryComponent />} />
          <Route path="/product" element={<ProductComponent />} />
           <Route path="/product/:page" element={<ProductComponent />} />
          <Route path="/product/:id/:page" element={<ProductComponent />} /> {/* Dynamic route for ProductComponent */}
          {/* <Route path="/product/:search" element={<ProductComponent />} /> */}
          {/* <Route path="/api/product/search" element={<ProductComponent />} /> */}
          <Route path="*" element={<>Page Not Found</>} /> {/* Route for Page Not Found */}
        </Routes>
      </Router>
    </div>
  )
}

export default App;
