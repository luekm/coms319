import { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [activeView, setActiveView] = useState('getCards');
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({
        id: 0,
        title: "",
        energy: 0,
        power: 0,
        ability: "",
        artist: "",
        image: "",
    });
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [deleteId, setDeleteID] = useState(0);


    const getCards = async () => {
        try {
            const response = await fetch("http://localhost:8081/getCards");
            const data = await response.json();
            setCards(data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    };


    const addCard = async () => {
        try {
            const response = await fetch("http://localhost:8081/addCard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCard)
            });
            if (!response.ok) {
                throw new Error("Failed to add card");
            }
            setNewCard({
                id: 0,
                title: "",
                energy: 0,
                power: 0,
                ability: "",
                artist: "",
                image: "",
            });
            setActiveView('getCards');

            getCards();
        } catch (error) {
            console.error("Error adding card:", error);
        }

    };
    const updateCard = async () => {
        try {
            const response = await fetch(`http://localhost:8081/updateCard/${selectedCardId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selectedCard)
            });
            if (!response.ok) {
                throw new Error("Failed to update card");
            }
            getCards();
            setActiveView('getCards');
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    const deleteCard = async () => {
        try {
            const response = await fetch(`http://localhost:8081/deleteCard/${deleteId}`, {
                method: "DELETE"
            });
            console.log("hello");
            console.log(response);
            if (!response.ok) {
                throw new Error("Failed to delete card");
            }
            getCards();
            setDeleteID(0);
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const parsedValue = name === 'id' || name === 'energy' || name === 'power' ? parseInt(value) : value;

        setNewCard(prevCard => ({
            ...prevCard,
            [name]: parsedValue
        }));
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;

        const parsedValue = name === 'id' || name === 'energy' || name === 'power' ? parseInt(value) : value;

        setSelectedCard(prevCard => ({
            ...prevCard,
            [name]: parsedValue
        }));
    };


    const handleViewChange = (view) => {
        setActiveView(view);
        if (view === 'getCards') {
            getCards();
        }
    };

    useEffect(() => {
        getCards();
    }, []);

    const renderContent = () => {
        switch (activeView) {
            case 'addCard':
                return (
                    <div>
                        <h2>Add Card</h2>
                        <form onSubmit={addCard}>
                            <div className="form-group">
                                <label>id:</label>
                                <input type="number" name="id" value={newCard.id} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Title:</label>
                                <input type="text" name="title" value={newCard.title} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Ability:</label>
                                <textarea name="ability" value={newCard.ability} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Energy:</label>
                                <input type="number" name="energy" value={newCard.energy} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Power:</label>
                                <input type="number" name="power" value={newCard.power} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Image:</label>
                                <input type="text" name="image" value={newCard.image} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Artist:</label>
                                <input type="text" name="artist" value={newCard.artist} onChange={handleInputChange} className="form-control" />
                            </div>


                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    addCard();
                                }}
                            >
                                Add Card
                            </button>
                        </form>
                    </div>
                );
            case 'getCards':
                return (
                    <div>
                        <h1>Card Database</h1>
                        <div className="card-container">
                            {cards.map((card) => (
                                <div key={card._id} className="card">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                                        className="card-image"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{card.title}</h5>
                                        <p className="card-text">Energy: {card.energy}, Power: {card.power}</p>
                                        <p className="card-text">{card.ability}</p>
                                        <p className="card-text">Artist: {card.artist}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'updateCard':
                return (
                    <div>
                        <h2>Update Card</h2>
                        <form onSubmit={updateCard}>
                            <div className="form-group">
                                <label>Select Card:</label>
                                <select
                                    className="form-control"
                                    value={selectedCardId || ''}
                                    onChange={(e) => {
                                        const selectedCardId = e.target.value;
                                        setSelectedCardId(selectedCardId);
                                        const selectedCard = cards.find(card => card.id === parseInt(selectedCardId));
                                        setSelectedCard(selectedCard || null);
                                    }}
                                    id="cardSelector"
                                    name="cardSelector"
                                >
                                    <option value="">Select Card ID</option>
                                    {cards.map((card) => (
                                        <option key={card.id} value={card.id}>{card.title}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedCard && (
                                <div>
                                    <div className="form-group">
                                        <label>Title:</label>
                                        <input type="text" name="title" value={selectedCard.title} onChange={handleUpdateChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Ability:</label>
                                        <textarea name="ability" value={selectedCard.ability} onChange={handleUpdateChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Energy:</label>
                                        <input type="number" name="energy" value={selectedCard.energy} onChange={handleUpdateChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Power:</label>
                                        <input type="number" name="power" value={selectedCard.power} onChange={handleUpdateChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL:</label>
                                        <input type="text" name="image" value={selectedCard.image} onChange={handleUpdateChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Artist:</label>
                                        <input type="text" name="artist" value={selectedCard.artist} onChange={handleUpdateChange} className="form-control" />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Update Card</button>
                                </div>
                            )}
                        </form>
                    </div>
                );

            case 'removeCard':
                return (
                    <div>
                        <h2>Remove Card</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            deleteCard();
                        }}>
                            <div className="form-group">
                                <label>Select Card:</label>
                                <select className="form-control" value={deleteId} onChange={(e) => setDeleteID(e.target.value)}>
                                    <option value="0">Select Card ID</option>
                                    {cards.map((card) => (
                                        <option key={card.id} value={card.id}>{card.title}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-danger">Remove Card</button>
                        </form>
                    </div>
                );

            case 'studentInfo':
                return (
                    <div>
                        <div className="card">
                            <h1>SE/ComS319 Construction of User Interfaces, Spring 2024</h1>
                            <p>May 8, 2024</p>
                            <div className="card-body">
                                <h2 className="card-title">Student Information</h2>
                                <h3 className="card-text">Name: Lucas Metcalf</h3>
                                <h3 className="card-text">Email: lmetcalf@iastate.edu</h3>
                                <h3 className="card-text">No teammate</h3>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="card-title"> Other Information</h2>
                                    <h3 className="card-text">Professor: Dr. Abraham N. Aldaco Gastelum</h3>
                                    <h3 className="card-text">Email: aaldaco@iastate.edu</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                );
            default:
                return null;
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'darkRed' }}>
                <a className="navbar-brand" href="#" style={{ color: 'white' }}> Marvel Snap Card Database</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'addCard' ? 'active' : ''}`} style={{ color: 'white' }} onClick={() => handleViewChange('addCard')}>Add New Card</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'getCards' ? 'active' : ''}`} style={{ color: 'white' }} onClick={() => handleViewChange('getCards')}>Card Database</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'updateCard' ? 'active' : ''}`} style={{ color: 'white' }} onClick={() => handleViewChange('updateCard')}>Update Card</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'removeCard' ? 'active' : ''}`} style={{ color: 'white' }} onClick={() => handleViewChange('removeCard')}>Remove Card</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link btn ${activeView === 'studentInfo' ? 'active' : ''}`} style={{ color: 'white' }} onClick={() => handleViewChange('studentInfo')}>Student Info</button>
                        </li>
                    </ul>
                </div>
            </nav>

            {renderContent()}
        </div>
    );
}

export default App;
