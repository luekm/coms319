import React, { useState, useEffect } from 'react';
import items from './products.json';

function Browse() {
    //hooks serving only cart

    return <div>Browse View</div>
}

function Cart({ onReturn, cart, total }) {

    let isNameFull = false;
    let isCreditCardFull = false;
    let isZipFull = false;
    let isEmailFull = false;

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        card: '',
        address1: '',
        city: '',
        state: '',
        zip: ''
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        card: '',
        zip: ''
    });

    const [isSummary, setIsSummary] = useState(false);

    const handleSummary = (e) => {
        setIsSummary(true);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateCard = (card) => {
        const regex = /^\d{16}$/;
        return regex.test(card);
    };

    const validateZip = (zip) => {
        const regex = /^\d{5}$/;
        return regex.test(zip);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (formData.fullName === '') {
            newErrors.fullName = 'Full name is required';
        } else {
            isNameFull = true;
        }
        if (formData.email === '' || !validateEmail(formData.email)) {
            newErrors.email = 'Invalid email address';
        } else {
            isEmailFull = true;
        }
        if (formData.card === '' || !validateCard(formData.card)) {
            newErrors.card = 'Invalid credit card number, must be 16 digits';
        } else {
            isCreditCardFull = true;
        }
        if (formData.zip === '' || !validateZip(formData.zip)) {
            newErrors.zip = 'Invalid zip code, must be 5 digits';
        } else {
            isZipFull = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            console.log('Form submitted:', formData);
        }
    }

    return (
        <div>

            {isSummary ? (
                <Summary onReturn={onReturn} cart={cart} total={total} formData={formData} />
            ) : (
                <div>
                    <button className="btn btn-primary" onClick={onReturn}>Return to browse</button>
                    <p> </p>
                    <ul className="list-group">
                        {cart.map(cartItem => (
                            <li key={cartItem.id}>
                                <img src={cartItem.image} alt={cartItem.title} style={{ width: '50px', marginRight: '10px' }} />
                                {cartItem.title} - Price: ${cartItem.price}
                            </li>
                        ))}
                    </ul>

                    <p>Subtotal: ${(total).toFixed(2)}</p>
                    <p>Tax: ${(total * 0.07).toFixed(2)}</p>
                    <p>Total: ${(total * 1.07).toFixed(2)}</p>
                    <div className="container">
                        <h2 className="mt-5">Payment Form</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label htmlFor="fullName" className="col-sm-2 col-form-label">Full Name:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                                    {errors.fullName && <span className="text-danger">{errors.fullName}</span>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="email" className="col-sm-2 col-form-label">Email:</label>
                                <div className="col-sm-10">
                                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="card" className="col-sm-2 col-form-label">Credit Card:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="card" name="card" value={formData.card} onChange={handleChange} />
                                    {errors.card && <span className="text-danger">{errors.card}</span>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="address1" className="col-sm-2 col-form-label">Address:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="address1" name="address1" value={formData.address1} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="city" className="col-sm-2 col-form-label">City:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="state" className="col-sm-2 col-form-label">State:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="state" name="state" value={formData.state} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="zip" className="col-sm-2 col-form-label">Zip Code:</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="zip" name="zip" value={formData.zip} onChange={handleChange} />
                                    {errors.zip && <span className="text-danger">{errors.zip}</span>}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={() => {
                                if (isCreditCardFull && isEmailFull && isNameFull && isZipFull) {
                                    handleSummary();
                                } else {
                                    // Handle the case when formData is empty
                                    alert('Please fill in the form data.');
                                }
                            }}>Submit</button>
                        </form>
                        <p></p>
                    </div>



                </div>
            )}</div>

    );
}

function Summary({ onReturn, cart, total, formData }) {
    //hooks serving only summary

    const redactedCard = formData.card.replace(/\d(?=\d{4})/g, '*');

    return (
        <div>
            <h2>Purchase Summary</h2>
            <h3>Purchased Items</h3>
            <ul>
                {cart.map((cartItem) => (
                    <li key={cartItem.id}>
                        <img src={cartItem.image} alt={cartItem.title} style={{ width: '50px', marginRight: '10px' }} />
                        {cartItem.title} - Price: ${cartItem.price}
                    </li>
                ))}
            </ul>
            <p>Subtotal: ${(total).toFixed(2)}</p>
            <p>Tax: ${(total * 0.07).toFixed(2)}</p>
            <p>Total: ${(total * 1.07).toFixed(2)}</p>
            <h3>User Information</h3>
            <p>Full Name: {formData.fullName}</p>
            <p>Email: {formData.email}</p>
            <p>Credit Card: {redactedCard}</p>
            <p>Address: {formData.address1}, {formData.city}, {formData.state}, {formData.zip}</p>
            <button className="btn btn-primary" onClick={onReturn}>Return to browse</button>
            <p> </p>
        </div>
    );
}

function App() {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [isCheckout, setIsCheckout] = useState(false);

    const addToCart = (el) => {


        setCart([...cart, el]);
    };

    const removeFromCart = (el) => {
        const updatedCart = cart.filter((cartItem) => cartItem.id !== el.id);
        setCart(updatedCart);
    };

    useEffect(() => {
        calculateTotal();
    }, [cart, searchResults]);

    const calculateTotal = () => {
        const itemsToCalculate = searchResults.length > 0 ? searchResults : cart;
        const totalVal = itemsToCalculate.reduce((acc, item) => acc + item.price, 0);
        setCartTotal(totalVal);
    };

    function howManyofThis(id) {
        let hmot = cart.filter((cartItem) => cartItem.id === id);
        return hmot.length;
    }

    const listItems = (
        <div className="row row-cols-1 row-cols-md-4 g-4">
            {searchResults.length > 0 ? (
                searchResults.map((el) => (
                    <div class="col-md-4 mb-4" key={el.id} style={{ border: '1px solid', borderRadius: '5px', }}>
                        <img class="card-img-top" src={el.image} alt={el.title} />
                        <div class="card-body">
                            <h5 class="card-title">{el.title}</h5>
                            <p class="card-text">{el.category}</p>
                            <p class="card-text">${el.price}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid black', padding: '5px', backgroundColor: 'lightgray', marginBottom: '10px' }}>
                                <span>{howManyofThis(el.id)}</span>
                                <div>
                                    <button type="button" className="btn btn-primary" onClick={() => addToCart(el)}>+</button>
                                    <button type="button" className="btn btn-danger" onClick={() => removeFromCart(el)}>-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                )
            ) : (
                items.map((el) => (
                    <div class="col-md-4 mb-4" key={el.id} style={{ border: '1px solid', borderRadius: '5px' }}>
                        <img class="card-img-top" src={el.image} alt={el.title} />
                        <div class="card-body">
                            <h5 class="card-title">{el.title}</h5>
                            <p class="card-text">{el.category}</p>
                            <p class="card-text">${el.price}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid black', padding: '5px', backgroundColor: 'lightgray', marginBottom: '10px' }}>
                                <span>{howManyofThis(el.id)}</span>
                                <div>
                                    <button type="button" className="btn btn-primary" onClick={() => addToCart(el)}>+</button>
                                    <button type="button" className="btn btn-danger" onClick={() => removeFromCart(el)}>-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div >
    );

    const handleSearch = (query) => {
        const results = items.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleCheckout = () => {
        setIsCheckout(true);
        console.log('Checkout clicked');
    };

    const handleReturnToBrowse = () => {
        setIsCheckout(false);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Guitars</a>
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => handleSearch(e.target.value)} />
                        <button className="btn btn-outline-success" type="button" onClick={handleCheckout}>Checkout</button>
                    </form>
                </div>
            </nav>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 cart">
                        <div className="title">
                            <div className="row">
                                <div className="col">
                                </div>
                                <div className="col align-self-center text-right text-muted">
                                </div>
                            </div>
                        </div>
                        {isCheckout ? <Cart onReturn={handleReturnToBrowse} cart={cart} total={cartTotal} /> : listItems}
                    </div>
                </div>
                <div className="float-end">
                    <p className="mb-0 me-5 d-flex align-items-center">
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
