import Nav from "react-bootstrap/Nav";

const SettingsNav = (section: string) => {
    return (
        <Nav variant="tabs" defaultActiveKey={`/settings/${section}`} className="justify-content-center">
            <Nav.Item>
                <Nav.Link href="/settings/info">Profile info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/settings/picture">Picture</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default SettingsNav

