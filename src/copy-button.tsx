import { toast } from "react-toastify";

const MyCopyButton = (props: { text: string }) => {
    const copySuccess = "Copied words to clipboard";
    const copyError = "Unable to copy words to clipboard";

    const copyWords = (_e: React.MouseEvent<HTMLElement>) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
                .writeText(props.text)
                .then(() => {
                    toast.info(copySuccess);
                })
                .catch((_err) => {
                    toast.error(copyError);
                });
        } else {
            toast.error(copyError);
        }
    };

    return (
        <button type="button" className="btn btn-outline-secondary" aria-label="Copy words to clipboard" onClick={copyWords}>
            Copy words To Clipboard
        </button>
    );
};

export default MyCopyButton;
