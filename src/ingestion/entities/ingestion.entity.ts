import { IngestionStatus } from "src/common/enums/ingestion.enum";
import { Document } from "src/document/entities/document.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ingestion')
export class Ingestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    documentId: number;

    @Column({ type: "enum", enum: IngestionStatus, default: IngestionStatus.Pending })
    status: IngestionStatus

    @ManyToOne(() => Document, (document) => document.ingestion, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'documentId' })
    document: Document;

    @Column({ nullable: true })
    error: string;
}
