import React, { useState } from 'react';
import useGlobalReducer from '../../../hooks/useGlobalReducer';
import useTooltip from '../../../hooks/useTooltip';

const PLACE_CATEGORIES = [
    { value: 'alojamiento', label: 'Alojamientos', faIcon: 'fa-bed' },
    { value: 'gastronomia', label: 'Gastronomía', faIcon: 'fa-utensils' },
    { value: 'transporte', label: 'Transporte', faIcon: 'fa-bus' },
    { value: 'salud', label: 'Salud', faIcon: 'fa-house-medical' },
    { value: 'cultura_turismo', label: 'Turismo', faIcon: 'fa-landmark-flag' },
    { value: 'recreacion', label: 'Ocio', faIcon: 'fa-champagne-glasses' },
    { value: 'deporte', label: 'Deporte', faIcon: 'fa-volleyball' },
    { value: 'gobierno', label: 'Oficinas', faIcon: 'fa-building-columns' },
    { value: 'baños', label: 'Baños', faIcon: 'fa-restroom' },
    { value: 'dinero', label: 'Bancos', faIcon: 'fa-money-bill-transfer' },
    { value: 'tiendas', label: 'Tiendas', faIcon: 'fa-bag-shopping' },
    { value: 'otros', label: 'Otros', faIcon: 'fa-ellipsis' },
];

export const FilterCategories = () => {
    const { state, dispatch } = useGlobalReducer()
    const { activeCategories = [] } = state;
    const [selectAllActive, setSelectAllActive] = useState(false)

    const tooltipRef = useTooltip({
        title: selectAllActive ? 'Seleccionar todo' : 'Deseleccionar todo',
        placement: 'bottom',
        trigger: 'hover'
    })

    const toggle = (value) => {
        const newValues = activeCategories.includes(value)
            ? activeCategories.filter((v) => v !== value)
            : [...activeCategories, value];

        dispatch({ type: 'SET_ACTIVE_CATEGORIES', payload: newValues });
    };

    const handleSelectAll = () => {
        const newSelect = PLACE_CATEGORIES.map((i) => i.value).slice(0, -1)

        dispatch({
            type: 'SET_ACTIVE_CATEGORIES',
            payload: selectAllActive
                ? newSelect
                : [],
        });
    };

    const handleClickSelectActive = () => {
        handleSelectAll()
        setSelectAllActive(!selectAllActive)
    }

    return (
        <section>
            {/* <h6 className="text-light m-0">Categorías</h6> */}
            <div className="d-flex flex-column gap-1">
                {PLACE_CATEGORIES.map((cat) => {
                    const isActive = activeCategories.includes(cat.value);

                    const tooltipRef = useTooltip({
                        title: cat.label,
                        placement: 'left',
                        trigger: 'hover'
                    })

                    return (
                        <div
                            ref={tooltipRef}
                            key={cat.value}
                            className='col flex-wrap'
                        >
                            <button
                                onClick={() => toggle(cat.value)}
                                className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 border-2 rounded-2 ${isActive
                                    ? 'btn-success border-success text-primary fw-bold shadow-sm'
                                    : 'btn-light border-light-subtle text-muted fw-bold opacity-50'
                                    }`}
                            >
                                <i
                                    className={`fa-solid ${cat.faIcon} ${isActive ? 'text-white' : 'text-muted'
                                        }`}
                                ></i>
                            </button>
                        </div>
                    );
                })}
                <div className="col">
                    <button
                        ref={tooltipRef}
                        onClick={handleClickSelectActive}
                        className={`btn btn-sm ${selectAllActive ? 'btn-light' : 'btn-danger'} w-100 d-flex flex-column align-items-center py-2 border-2 rounded-2 fw-bold shadow-sm`}
                    >
                        <i className={`fa-solid ${selectAllActive ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                    </button>
                </div>
            </div>
        </section>
    );
};
