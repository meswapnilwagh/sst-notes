import { Storage } from 'aws-amplify';
import onError from './errorLib';

const s3upload = async (file: File) => {
    try {
        const fileName = `${Date.now()}-${file.name}`
        const stored = await Storage.vault.put(fileName, file, {
            contentType: file.type
        });
        return stored.key
    } catch (err) {
        onError(err)
        return "";
    }
}

export default s3upload;