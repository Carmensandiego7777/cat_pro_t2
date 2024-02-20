import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

import "./product.css";
import axios from "axios";
import searchIcon from "../assets/search.png";

function ProductComponent() {
  const { id, page } = useParams();
  const Id = id?.includes("cid") ? +id?.match(/\d+/)[0] : "";
  const Page = page?.includes("pg") ? +page?.match(/\d+/)[0] : 1;
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentProducts, setCurrentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const [selectedCategory, setSelectedCategory] = useState(""); // Add selectedCategory state
  const [categories, setCategories] = useState([]); // Add categories state

  useEffect(() => {
    fetchProducts(selectedCategory);
    const newUrl = `/product${
      selectedCategory !== "" ? "/cid=" + selectedCategory : ""
    }/pg=${currentPage}`;
    window.history.pushState(null, "", newUrl);
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    fetchCategories(); // Fetch categories when component mounts
    fetchProducts(Id);
    setCurrentPage(Page);
    setSelectedCategory(Id);
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    setCurrentProducts(products.slice(startIndex, endIndex));
  }, [currentPage, products]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5500/api/products/${id}`
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery !== "") handleSearch();
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const url = `http://localhost:5500/api/product/search?query=${searchQuery}`;
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const searchData = await response.json();
      setProducts(searchData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setCurrentPage(1); // Reset current page to 1 when category changes
    setSelectedCategory(selectedCategoryId); // Update selected category
    console.log(setSelectedCategory(selectedCategoryId));
    console.log(selectedCategoryId);
    console.log("hello", selectedCategoryId);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div id="sizze">
      <nav className="navbar navbar-expand-lg navbar-light bg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"></a>
          <Link to="/" className="btn btn-primary">
            Back
          </Link>
          <div className="ms-auto me-3">
            <select
              id="categorySelect"
              onChange={handleCategoryChange}
              className="form-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.CategoryId} value={category.CategoryId}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="search"
              placeholder="Search"
              name="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control mr-2"
            />
            <img src={searchIcon} alt="Search Icon" width={30} height={30} />
          </div>
        </div>
      </nav>
      <div className="container-fluid">
        <h2 className="mb-4 font-weight-bold text-primary font-sans-serif">
          PRODUCT
        </h2>
        <div className="d-flex justify-content-between align-items-center mb-3"></div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <div className="output">
            <table
              className="table table-striped table-bordered"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th className="fw-bold">ProductID</th>
                  <th className="fw-bold">ProductName</th>
                  <th className="fw-bold">CategoryName</th>
                  <th className="fw-bold">CategoryId</th>
                  <th className="fw-bold">Brand</th>
                  <th className="fw-bold">MRP</th>
                  <th className="fw-bold">DiscountPrice</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.ProductID}>
                    <td>{product.ProductID}</td>
                    <td>{product.ProductName}</td>
                    <td>{product.CategoryName}</td>
                    <td>{product.CategoryId}</td>
                    <td>{product.Brand}</td>
                    <td>{product.MRP}</td>
                    <td>{product.DiscountPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-container d-flex justify-content-between align-items-center center-buttons">
            <button
              className={`btn btn-primary ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => paginate(currentPage - 1)}
              style={{ marginRight: "200px" }}
            >
              Previous
            </button>
            <nav aria-label="...">
              <ul className="pagination justify-content-center">
                {Array.from({
                  length: Math.ceil(products.length / itemsPerPage),
                }).map((_, index) => {
                  if (
                    index === 0 ||
                    index === Math.ceil(products.length / itemsPerPage) - 1 ||
                    (index >= currentPage - 2 && index <= currentPage + 2)
                  ) {
                    return (
                      <li
                        key={index + 1}
                        className={`page-item ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    );
                  } else if (
                    index === currentPage - 3 ||
                    index === currentPage + 3
                  ) {
                    return (
                      <li key={index + 1} className="page-item disabled">
                        <span>...</span>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </nav>
            <button
              className={`btn btn-primary ${
                currentPage === Math.ceil(products.length / itemsPerPage)
                  ? "disabled"
                  : ""
              }`}
              onClick={() => paginate(currentPage + 1)}
              style={{ marginLeft: "200px" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductComponent;
