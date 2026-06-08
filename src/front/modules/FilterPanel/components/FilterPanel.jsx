import React, { useState } from 'react';
import { FilterAccessibility } from './FilterAccessibility';
import { FilterCategories } from './FilterCategories';
import '../css/FilterPanel.css';

export const FilterPanel = () => {
    const [show, setShow] = useState(true);

    const toggle = () => setShow(prev => !prev);

    return (
        <>
            <div
                // className={`
                //     position-absolute end-0 ms-5
                //     ${show ? 'filter-open' : 'filter-closed'} z-1`}
                className='position-absolute end-0 ms-5 z-1'
            >
                <div
                    className="d-flex flex-column gap-3 p-2 overflow-auto"
                    style={{
                        background: 'rgba(0,0,0,0.65)',
                        pointerEvents: 'auto',
                        maxHeight: 'calc(100vh - 140px)',
                    }}
                >
                    <FilterAccessibility />
                    <hr className='text-light m-0' />
                    <FilterCategories />
                </div>
            </div>

            {/* BOTÓN FLOTANTE */}
            {/* <button
                className="btn btn-sm btn-primary position-absolute end-0 top-0 rounded-start-pill shadow-sm d-flex align-items-center justify-content-center z-3"
                style={{
                    // top: '5px',
                    transition: 'right 0.35s ease'
                }}
                onClick={toggle}
            >
                {show ? '❯' : '❮'}
            </button> */}
        </>
    );
};
