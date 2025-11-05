import { BrowserRouter } from './router';
import './App.css';
import Header from './components/Header/Header';
import Footer from './footer/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <main>
                <AppRoutes />
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
