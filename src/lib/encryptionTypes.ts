export interface EncryptionStatus{

algorithm:"AES-256"|"RSA-4096";

databaseEncrypted:boolean;

backupEncrypted:boolean;

fileStorageEncrypted:boolean;

keyRotationDays:number;

lastRotation:string;

}
