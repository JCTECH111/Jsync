import { uploadFile } from "./uploadFile";
import { createFileContent } from "./fileContent";
import { createFileMetadata } from "./fileMetadata";
import { saveActivity } from "./saveActivity";

export const registerUploadedFile = async (
    file,
    documentId,
    fileName,
    fileType,
    createdAt,
    updatedAt,
    isPublic = false,
    Label = '',
    fileSize,
    folderId,
    ownerId,
) => {
    try {
        if (!file || !documentId) {
            throw new Error('File and document ID are required');
        }

        // Step 1: Upload file
        const mainFile = await uploadFile(file, documentId);

        // step2
        const mainFileMetaData = await createFileMetadata(documentId, [fileType]);



        // Step 2: Create metadata
        const mainFileData = await createFileContent(
            documentId,
            fileName,
            fileType,
            createdAt,
            updatedAt,
            isPublic,
            Label,
            fileSize,
            folderId,
            ownerId,
        );
        const activity = {
            ownerId:ownerId ,
            type: "upload",
            message: "You uploaded a new document",
            timeStamp: createdAt,
            documentName:fileName ,
          };
          
          saveActivity(activity);
        console.log('Uploaded file metadata:', mainFileData);

        return { file: mainFile, metadata: mainFileData, sharedData:mainFileMetaData }; // Return both file and metadata
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error; // Re-throw error for higher-level handling
    }
};
