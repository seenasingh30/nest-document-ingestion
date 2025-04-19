import { IsNotEmpty } from "class-validator";

export class CreateDocumentDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    fileUrl?: string;


    uploadedBy?: number;
}
