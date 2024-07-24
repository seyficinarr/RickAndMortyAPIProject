import React, { useState } from 'react';
import { useQuery } from 'react-query';  // Import useQuery hook from react-query
import { getCharacters } from '../api/api';  // Import API function to get characters
import CharacterTable from '../components/CharacterTable';  // Import CharacterTable component
import CharacterDetails from '../components/CharacterDetails';  // Import CharacterDetails component
import { Container, Typography } from '@mui/material';  // Import components from Material-UI

const HomePage = () => {
  // State to keep track of the selected character
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  // State to keep track of the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // useQuery hook to fetch characters data for the current page
  const { data, error, isLoading } = useQuery(['characters', currentPage], () => getCharacters(currentPage));

  // Display loading message while data is being fetched
  if (isLoading) return <Typography>Loading...</Typography>;
  // Display error message if there is an error fetching data
  if (error) return <Typography>Error loading data</Typography>;

  return (
    <Container>
      {/* Render the CharacterTable component with fetched characters data */}
      <CharacterTable characters={data.results} onSelectCharacter={setSelectedCharacter} />
      {/* Render the CharacterDetails component with the selected character */}
      <CharacterDetails character={selectedCharacter} />
    </Container>
  );
};

export default HomePage;