import { Toaster } from 'react-hot-toast';
import { BoardsPage } from './pages/BoardsPage.jsx';

function App() {
  return (
    <div className="App">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
      
      {/* Main application */}
      <BoardsPage />
    </div>
  );
}

export default App;