import React, { useEffect, useState } from "react";
import "./CharacterTable.css"; // Import custom CSS
import Pagination from "./Pagination"; // Import Pagination component

const CharacterTable = () => {
    // State to store the list of characters
    const [characters, setCharacters] = useState([]);
    
    // State to store filter values
    const [filters, setFilters] = useState({
        id: "",
        name: "",
        status: "",
        species: "",
        gender: ""
    });

    // State to store the number of rows to display per page
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // State to store sorting configuration
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

    // State to store the currently selected character
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // State to store any error message
    const [error, setError] = useState(null);

    // State to manage pagination
    const [currentPage, setCurrentPage] = useState(1);
    const charactersPerPage = rowsPerPage;
    const indexOfLastCharacter = currentPage * charactersPerPage;
    const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;

    // Fetch all characters from the API when the component mounts
    useEffect(() => {
        const fetchAllCharacters = async () => {
            let allCharacters = [];
            let page = 1;
            let totalCharacters = 826; // Total number of characters
            try {
                // Fetch characters page by page
                while (allCharacters.length < totalCharacters) {
                    const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }
                    const data = await response.json();
                    allCharacters = allCharacters.concat(data.results);
                    page++;
                }
                setCharacters(allCharacters);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchAllCharacters();
    }, []);

    // Handle filter input changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle sorting by column
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Memoized sorted characters
    const sortedCharacters = React.useMemo(() => {
        let sortableCharacters = [...characters];
        if (sortConfig.key !== null) {
            sortableCharacters.sort((a, b) => {
                const aValue = getValueForSort(a, sortConfig.key);
                const bValue = getValueForSort(b, sortConfig.key);
                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCharacters;
    }, [characters, sortConfig]);

    // Filtered characters based on filters
    const filteredCharacters = sortedCharacters.filter((character) => {
        return Object.keys(filters).every((key) => {
            const value = filters[key].toLowerCase().trim();

            if (value === "") {
                return true; // Skip filtering if the filter value is empty or whitespace
            }

            // Handle filtering by id
            if (key === "id") {
                return character.id.toString().includes(value);
            }

            // For other properties like name, status, species, gender
            return character[key].toString().toLowerCase().includes(value);
        });
    });

    // Function to get value for sorting or filtering based on key (handles nested properties)
    const getValueForSort = (obj, key) => {
        if (key.includes('.')) {
            return key.split('.').reduce((o, i) => o && o[i], obj);
        }
        return obj[key];
    };

    // Paginated characters
    const currentCharacters = filteredCharacters.slice(indexOfFirstCharacter, indexOfLastCharacter);

    // Total number of pages
    const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

    // Handle page change
    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Validate input for rows per page
    const handleRowsPerPageChange = (e) => {
        const { value } = e.target;
        if (value > 0) {
            setRowsPerPage(Number(value));
        } else {
            // Optionally, display a message or handle the error
            // Here, we can simply ignore values less than or equal to zero
        }
    };

    // Handle row click to select a character
    const handleRowClick = (character) => {
        setSelectedCharacter(character);
    };

    return (
        <div className="container">
            <div className="controls">
                <label>
                    Rows per page:
                    <input
                        type="number"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        min="1"
                        placeholder="Rows per page"
                    />
                </label>
            </div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <h1>Rick and Morty Characters</h1>
            <table className="character-table">
                <thead>
                    <tr>
                        <th>ID</th> {/* New column for ID */}
                        {[
                            { key: 'name', label: 'NAME' },
                            { key: 'status', label: 'STATUS' },
                            { key: 'species', label: 'SPECIES' },
                            { key: 'gender', label: 'GENDER' }
                        ].map(({ key, label }) => (
                            <th key={key}>
                                {label}
                                <span className="sort-icon" onClick={() => handleSort(key)}>
                                    {sortConfig.key === key ? (sortConfig.direction === "ascending" ? '↑' : '↓') : '⇅'}
                                </span>
                                <input type="text" name={key} placeholder="Filter" onChange={handleFilterChange} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentCharacters.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-results">No characters found matching the filters.</td>
                        </tr>
                    ) : (
                        currentCharacters.map((character) => (
                            <tr key={character.id} onClick={() => handleRowClick(character)}>
                                <td>{character.id}</td> {/* Display ID */}
                                <td>{character.name}</td>
                                <td>{character.status}</td>
                                <td>{character.species}</td>
                                <td>{character.gender}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {/* Pagination component */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            {/* Selected character details section */}
            {selectedCharacter && (
                <div className="selected-character-details">
                    <h2>{selectedCharacter.name}</h2>
                    <img src={selectedCharacter.image} alt={selectedCharacter.name} />
                    <p><strong>Status:</strong> {selectedCharacter.status}</p>
                    <p><strong>Species:</strong> {selectedCharacter.species}</p>
                    <p><strong>Gender:</strong> {selectedCharacter.gender}</p>
                    <p><strong>Origin:</strong> {selectedCharacter.origin.name}</p>
                    <p><strong>Location:</strong> {selectedCharacter.location.name}</p>
                </div>
            )}
        </div>
    );
};

export default CharacterTable;
