import { BrowserRouter } from './router';
import './App.css';
import Header from './layout/header/Header';
import Footer from './layout/footer/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './features/auth/AuthContext';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app-shell">
                    <Header />
                    <main>
                        <AppRoutes />
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
