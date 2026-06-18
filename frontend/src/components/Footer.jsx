export const Footer = () => {
    const fecha = new Date().getFullYear();

    return (
        <div className="bg-success border-top-border-2">
            <footer className="container d-flex justify-content-between align-items-center py-2">
                <h4 className="m-0">Viajar es para todos</h4>
                <p className="fw-bold m-0">Copyright &copy; {fecha}</p>
            </footer>
        </div>
    );
};
