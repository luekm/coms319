import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    const [activeView, setActiveView] = useState('addProduct');
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: "",
        title: "",
        description: "",
        price: 0,
        image: "",
        rating: { rate: 0, count: 0 }
    });
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({
        id: "",
        title: "",
        description: "",
        price: 0,
        image: "",
        rating: { rate: 0, count: 0 }
    });
    const [deleteId, setDeleteID] = useState("");


    const getProducts = async () => {
        try {
            const response = await fetch("http://localhost:8081/getCatalog");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    const addProduct = async () => {
        try {
            const response = await fetch("http://localhost:8081/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) {
                throw new Error("Failed to add product");
            }
            setNewProduct({
                id: "",
                title: "",
                description: "",
                price: 0,
                image: "",
                rating: { rate: 0, count: 0 }
            });
            getProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };
    const updateProduct = async () => {
        try {
            const response = await fetch(`http://localhost:8081/updateProduct/${selectedProductId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selectedProduct)
            });
            if (!response.ok) {
                throw new Error("Failed to update product");
            }
            getProducts();
            setActiveView('getProducts');
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8081/delete/${productId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }
            getProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };


    const handleViewChange = (view) => {
        setActiveView(view);
        if (view == 'getProducts') {
            getProducts();
        }
        if (view == 'addProduct') {
            //  addProduct();
        }
    };

    useEffect(() => {
        getProducts();
    }, []);




    const renderContent = () => {
        switch (activeView) {
            case 'addProduct':
                return (
                    <div>
                        <h2>Add Product</h2>
                        <form onSubmit={addProduct}>
                            <div className="form-group">
                                <label>id:</label>
                                <input type="number" name="id" value={newProduct.id} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Title:</label>
                                <input type="text" name="title" value={newProduct.title} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea name="description" value={newProduct.description} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Image URL:</label>
                                <input type="text" name="image" value={newProduct.image} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Rating:</label>
                                <input type="number" name="rating" value={newProduct.rating.rate} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Rating count:</label>
                                <input type="number" name="count" value={newProduct.rating.count} onChange={handleInputChange} className="form-control" />
                            </div>
                            <button
                                type="button" // Change type to button to prevent form submission on click
                                className="btn btn-primary"
                                onClick={() => {
                                    addProduct(); // Call addProduct function on button click
                                }}
                            >
                                Add Product
                            </button>
                        </form>
                    </div>
                );
            case 'getProducts':
                return (
                    <div>
                        {/* Product List */}
                        <h1>Product Catalog</h1>
                        <div className="product-container">
                            {products.map((product) => (
                                <div key={product._id} className="card">
                                    <img src={product.image} alt={product.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.title}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <p className="card-text">Price: ${product.price}</p>
                                        <p className="card-test">Rating: {product.rating.rate} Count: {product.rating.count}</p>
                                        {/* Add more details as needed */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'updateProduct':
                return (
                    <div>
                        {/* Update Product Form */}
                        <h2>Update Product</h2>
                        {/* Add your form or content for updating product */}
                        <form onSubmit={updateProduct}>
                            <div className="form-group">
                                <label>Select Product:</label>
                                <select className="form-control" value={selectedProductId || ''} onChange={(e) => {
                                    setSelectedProductId(e.target.value);
                                    const selectedProduct = products.find(product => product.id === e.target.value);
                                    setSelectedProduct(selectedProduct || {
                                        id: "",
                                        title: "",
                                        description: "",
                                        price: 0,
                                        image: "",
                                        rating: { rate: 0, count: 0 }
                                    });
                                }}>
                                    <option value="">Select Product ID</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.title}</option>
                                    ))}
                                </select>
                            </div>
                            { }
                            <div className="form-group">
                                <label>Product ID:</label>
                                <input type="text" name="id" value={selectedProduct.id} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Title:</label>
                                <input type="text" name="title" value={selectedProduct.title} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea name="description" value={selectedProduct.description} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input type="number" name="price" value={selectedProduct.price} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Image URL:</label>
                                <input type="text" name="image" value={selectedProduct.image} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Rating:</label>
                                <input type="number" name="rating" value={selectedProduct.rating.rate} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Rating count:</label>
                                <input type="number" name="count" value={selectedProduct.rating.count} onChange={handleUpdateChange} className="form-control" />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Product</button>
                        </form>
                    </div>
                );
            case 'removeProduct':
                return (
                    <div>
                        <h2>Remove Product</h2>
                        <div className="form-group">
                            <label>Select Product to Delete:</label>
                            <select className="form-control" value={selectedProductId || ''} onChange={(e) => setSelectedProductId(e.target.value)}>
                                <option value="">Select Product ID</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.title}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-danger" onClick={() => deleteProduct(selectedProductId)}>Delete Product</button>
                    </div>
                );
            case 'studentInfo':
                return (
                    <div>
                        <h2>Student Information</h2>
                        <h1>Lucas Metcalf</h1>
                        <h1>lmetcalf@iastate.edu</h1>
                        <h1>No teammate</h1>

                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">FakeStore</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'addProduct' ? 'active' : ''}`} onClick={() => handleViewChange('addProduct')}>Add Product</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'getProducts' ? 'active' : ''}`} onClick={() => handleViewChange('getProducts')}>Get Products</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'updateProduct' ? 'active' : ''}`} onClick={() => handleViewChange('updateProduct')}>Update Product</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'removeProduct' ? 'active' : ''}`} onClick={() => handleViewChange('removeProduct')}>Remove Product</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'studentInfo' ? 'active' : ''}`} onClick={() => handleViewChange('studentInfo')}>Student Info</button>
                        </li>
                    </ul>
                </div>
            </nav>

            {renderContent()}
        </div>
    );
}

export default App;
