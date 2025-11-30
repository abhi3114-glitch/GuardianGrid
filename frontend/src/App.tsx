import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProofPage from './pages/ProofPage';

function App() {
    return (
        <SocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                    </Route>
                    <Route path="/proof/:sessionId" element={<ProofPage />} />
                </Routes>
            </BrowserRouter>
        </SocketProvider>
    );
}

export default App;
