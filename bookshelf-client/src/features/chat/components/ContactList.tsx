import Table from 'react-bootstrap/Table';
import Loading from '../../loading/Loading';
import { ContactListState } from '../hooks/useChatHub';
import { Contact } from '../types/chatTypes';

type ContactListProps = {
    contactList: ContactListState,
    selectedUser: string
    setSelectedUser: Function
}

const ContactList = ({ contactList, selectedUser, setSelectedUser }: ContactListProps) => {
    let {users, loading} = contactList
    return (
        <Table striped hover id="contacts-table">
            <thead>
                <tr>
                    <th colSpan={2}>Contacts</th>
                </tr>
            </thead>
            <tbody>
            {(!users || loading) && <tr><td><br /><Loading /></td></tr>}
                {users && users.length > 0 && users.map((user: Contact) => (
                    <tr key={user.username} onClick={() => setSelectedUser(user.username)} className={`contact ${user.username === selectedUser ? '' : 'enabled'}`}>
                            <td className='col-username'>  
                            <div>
                                {user.username} {user.username === selectedUser && <i className='fas fa-comments active-chat' />}
                            </div>
                            </td>
                            <td className={`col-new-messages ${user.username === selectedUser ? `td-selected` : `td-new-messages`}`}>
                            <div>
                                    {user.username !== selectedUser && user.newMessages > 0 && 
                                    <><i className='far fa-comment'/><sup> +{user.newMessages}</sup></>}
                            </div>
                            </td>
                            <td className={`col-status td-status ${user.connected ? 'is-online' : 'is-offline'}`}>
                            <div>
                                {user.connected ? 'online' : 'offline'}
                            </div>
                            </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};

export default ContactList;