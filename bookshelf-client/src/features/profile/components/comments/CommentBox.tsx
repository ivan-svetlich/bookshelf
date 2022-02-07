import IComment from "../../../../types/comment";
import ProfilePicture from "../ProfilePicture";

type CommentBoxProps = {
    comment: IComment
}

const CommentBox = ({comment}: CommentBoxProps) => {
    return (
        <tr className="no-border" id={`comment-${comment.id}`}>
            <td className="picture-col no-border">
                <ProfilePicture source={comment.submitterPicture} sourceType="base64" className="comment-picture img-fluid"/>
            </td>
            <td className="body-col no-border">
            <div className="comment-header">
                <span><b><a href={`/profile/${comment.submitterUsername}`}>{comment.submitterUsername}</a></b></span>
            </div>
            <div className="comment-body">
                {comment.body}
            </div>
            </td>
            <td className="date-col no-border">
                <span>{getFormattedDateTime(comment.createdAt)}</span>
            </td>
        </tr>
    );
};

function getFormattedDateTime(datetime: Date) {

    return new Date(datetime).toString().split('GMT')[0];
}

export default CommentBox;