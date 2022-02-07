import '../styles/headerStyles.css';
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Message } from '../../../store/slices/messageSlice';
import { useAppSelector } from '../../../store/hooks/redux';
import MessageToast from '../../../routes/MessageToast';

type SubHeaderProps = {
    title: string,
    icon?: string,
    childComp?: React.FunctionComponent
}
const SubHeader = ({title, childComp, icon}: SubHeaderProps) => {
    let message: Message = useAppSelector(state => state.messages);
    
    return (
        <div className="sub-header">
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                <Container><div className="title"><i className={icon}></i>{` ${title}`}</div></Container>
            </Navbar>
            <div className="child-container">
                {childComp ? 
                    childComp({}) : ''
                }
            </div>
            <div id="msg-container">
                {message.content ? <MessageToast content={message.content} variant={message.variant} /> : ''}
            </div>
        </div>
    );
};

export default SubHeader;