import { IsNotEmpty } from "class-validator";
import { IngestionStatus } from "src/common/enums/ingestion.enum";

export class CreateIngestionDto {

    @IsNotEmpty()
    documentId: number;

    @IsNotEmpty()
    fileUrl: string;

    status?: IngestionStatus;

    error?: string;
}
