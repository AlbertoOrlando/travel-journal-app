import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DefaultLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header con navbar sticky */}
            <header className="sticky top-0 z-50 bg-white shadow">
                <Navbar />
            </header>

            {/* Contenuto principale */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 pt-20">
                <Outlet />
            </main>

            {/* Footer opzionale */}
            <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
                © 2025 - Il tuo progetto
            </footer>
        </div>
    );
};

export default DefaultLayout;
