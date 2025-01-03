import { uploadFile } from "./uploadFile";
import { createFileContent } from "./fileContent";

export const registerUploadedFile = async (
    file,
    documentId,
    fileName,
    fileType,
    createdAt,
    updatedAt,
    ownerId,
    folderId,
    isPublic = false,
    Label = '',
    fileSize,
) => {
    try {
        if (!file || !documentId) {
            throw new Error('File and document ID are required');
        }

        // Step 1: Upload file
        const mainFile = await uploadFile(file, documentId);


        // Step 2: Create metadata
        const mainFileData = await createFileContent(
            documentId,
            fileName,
            fileType,
            createdAt,
            updatedAt,
            ownerId,
            folderId,
            isPublic,
            Label,
            fileSize,
        );
        console.log('Uploaded file metadata:', mainFileData);

        return { file: mainFile, metadata: mainFileData }; // Return both file and metadata
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error; // Re-throw error for higher-level handling
    }
};
