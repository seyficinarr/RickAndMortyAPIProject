import React from 'react';

// CharacterDetails component to display details of the selected character
const CharacterDetails = ({ character }) => {
  // If no character is selected, show a prompt message
  if (!character) return <p>Click on a row to see details of the character</p>;

  // Render the details of the selected character
  return (
    <div>
      <h2>{character.name}</h2>  {/* Display character's name */}
      <p>Status: {character.status}</p>  {/* Display character's status */}
      <p>Species: {character.species}</p>  {/* Display character's species */}
      <p>Gender: {character.gender}</p>  {/* Display character's gender */}
      <img src={character.image} alt={character.name} />  {/* Display character's image */}
    </div>
  );
};

export default CharacterDetails;
