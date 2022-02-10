import Alert from "react-bootstrap/Alert";

type ErrorAlertProps = {
  error: string;
  visible: boolean;
};

const ErrorAlert = ({ error, visible }: ErrorAlertProps) => {
  return (
    <Alert variant="danger" className={visible ? "" : "invisible"}>
      {getErrorMessage(error)}
    </Alert>
  );
};

function getErrorMessage(error: string) {
  switch (error) {
    case "size":
      return "Maximum file size allowed: 10Mb";
    case "noFile":
      return "No file selected";
    case "fileType":
      return "Allowed extensions: .PNG, .JPG, .JPEG";
    default:
      return "Default invisible message";
  }
}

export default ErrorAlert;
