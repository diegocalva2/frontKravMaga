
import Button from '@mui/material/Button';

function App() {
  return (
    <>
      <Button variant="contained">Contained</Button>
      <Button variant="contained" disabled>
        Disabled
      </Button>
      <Button variant="contained" href="#contained-buttons">
        Link
      </Button>
    </>
  );
}

export default App;