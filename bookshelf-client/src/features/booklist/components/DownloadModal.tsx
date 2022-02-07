import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";

type DownloadModalProps = {
    show: boolean,
    fileType: string,
    setDownload: Function,
    setFileType: Function,
    handleClose: Function
}
const DownloadModal = ({show, fileType, setDownload, setFileType, handleClose}: DownloadModalProps) => {

    const handleDownload = () => {
        setDownload(true);
        handleClose();
    }
    return (
        <Modal show={show} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title><i className="fas fa-download"/> Download booklist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="file-type-div">
                    <span>Select file type: </span>
                    <i className={fileType === "pdf" ? "fas fa-file-pdf fa-2x" : "fas fa-file-csv fa-2x"} id="file-type-icon"/>
                    <select defaultValue={fileType} onChange={(e) => setFileType(e.target.value)} id="file-type-select">
                        <option value="pdf">pdf</option>
                        <option value="csv">csv</option>
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => handleClose()}>
                Close
            </Button>
            <Button variant="primary" onClick={() => handleDownload()}>
                Download
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DownloadModal;