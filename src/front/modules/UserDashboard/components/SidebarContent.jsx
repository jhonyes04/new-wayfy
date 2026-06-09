import { memo } from "react"
import { Nav, Button } from 'react-bootstrap'
import { UserAvatar } from "./UserAvatar";

export const SidebarContent = memo(({ activeTab, setActiveTab, setShowMobileMenu, menuItems, handle_logout, tooltipRef }) => {
    return (
        <div className="d-flex flex-column h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <UserAvatar />

                <i
                    ref={tooltipRef}
                    className="fa-solid fa-right-from-bracket fs-4 text-danger"
                    style={{ cursor: 'pointer' }}
                    onClick={handle_logout}
                ></i>
            </div>

            <Nav className="flex-column flex-grow-1 gap-1">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? 'success' : 'light'}
                            onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                            className={`d-flex align-items-center gap-3 w-100 text-start border-0 px-3 py-2 ${isActive ? '' : 'text-dark bg-transparent'}`}
                            style={{ borderRadius: '10px' }}
                        >
                            <i className={`fa-solid ${item.iconClass} fa-fw fs-5`}></i>
                            <span className="small fw-medium">{item.label}</span>
                        </Button>
                    );
                })}
            </Nav>
        </div>
    )
}
)
