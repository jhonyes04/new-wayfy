import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const PageLayout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="d-flex justify-content-center flex-grow-1 position-relative overflow-hidden">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    );
};

export default PageLayout;
