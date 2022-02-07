import Nav from "react-bootstrap/esm/Nav";

const FriendsNav = (section: string) => {
    return (
        <Nav variant="tabs" defaultActiveKey={`/friends/${section}`} className="justify-content-center">
            <Nav.Item>
                <Nav.Link href="/friends/list">My friends</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/friends/pending">Pending requests</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/friends/add">Add friend</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default FriendsNav;