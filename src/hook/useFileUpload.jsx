import {useUploadFileMutation} from "../redux/feature/file/fileApiSlice.js";

function useFileUpload() {
    const [uploadFile, {isLoading}] = useUploadFileMutation();
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 1024 * 1024 * 2; // 2MB

    const upload = async (event, onError, onSuccess) => {
        const file = event.target.files[0];
        const input = event.target; // Save reference before async operations

        if (!file) return;

        if (file.size > maxSize) {
            onError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 2 MB.`);
            input.value = '';
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            onError("Only JPG and PNG images are allowed.");
            input.value = '';
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await uploadFile(formData).unwrap();
            await onSuccess?.(response);
        } catch (error) {
            onError(error.data.error.description);
        } finally {
            input.value = ''; // Clears on both success and error
        }
    }

    return {upload, isLoading};

}

export default useFileUpload;