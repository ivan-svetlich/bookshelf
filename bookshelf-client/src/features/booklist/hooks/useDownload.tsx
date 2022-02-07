import { useEffect } from "react";
import books from "../../../utils/api/books";

type DownloadProps = {
    download: boolean,
    setDownload: Function
    fileType: string,
    setBtnDisabled: Function,
    setFileLoading: Function,
}

const useDownload = ({download, setDownload, fileType, setBtnDisabled, setFileLoading}: DownloadProps) => {
    useEffect(() => {
        async function downloadFile() {
            if(download) {
                setDownload(false);
                setBtnDisabled(true);
                setFileLoading(true);

                const response = await books.getFile(fileType);

                var file = base64ToArrayBuffer(response.data.file);
                var blob = new Blob([file], { type: response.data.type });
                var url = URL.createObjectURL(blob);

                // create <a> tag dinamically
                var fileLink = document.createElement('a');
                fileLink.href = url;
                // it forces the name of the downloaded file
                fileLink.download = `${response.data.filename}.${fileType}`;
                // triggers the click event     
                setFileLoading(false);
                fileLink.click();
                setBtnDisabled(false);
            }
        }
        downloadFile();
    })
}

function base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

export default useDownload;