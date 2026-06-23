const mobilityOptions = [
    {
        id: 'silla',
        label: 'Usuario de silla de ruedas',
        icon: 'fa-wheelchair-move',
    },
    {
        id: 'andador',
        label: 'Uso de andador/bastón',
        icon: 'fa-person-walking-with-cane',
    },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-person-walking' },
    { id: 'mayor', label: 'Persona mayor', icon: 'fa-user-nurse' },
    { id: 'without', label: 'Sin limitations', icon: 'fa-check' },
];

export const MobilitySection = ({ selectedMobility, toggleMobility }) => {
    return (
        <section>
            <h5 className="text-primary mb-3 border-bottom pb-2">
                <i className="fa-solid fa-wheelchair-move me-2 text-muted"></i>
                Condiciones de Movilidad
            </h5>
            <div className="d-flex flex-column gap-2">
                {mobilityOptions.map((opt) => {
                    const isSelected = selectedMobility.includes(opt.id);

                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleMobility(opt.id)}
                            className={`btn btn-sm w-100 d-flex align-items-center py-2.5 px-3 border-2 rounded-2 transition-all ${
                                isSelected
                                    ? 'btn-success border-success text-white shadow-sm'
                                    : 'btn-light border-light-subtle text-muted opacity-75'
                            }`}
                        >
                            <div className="d-flex align-items-center gap-3 w-100">
                                <i
                                    className={`fa-solid ${opt.icon} ${isSelected ? 'text-white' : 'text-secondary'} fs-5`}
                                ></i>
                                <span className="fw-semibold text-start flex-grow-1">
                                    {opt.label}
                                </span>
                                {isSelected && (
                                    <i className="fa-solid fa-circle-check text-white"></i>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
