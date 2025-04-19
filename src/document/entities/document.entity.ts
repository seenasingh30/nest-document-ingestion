import { Ingestion } from "src/ingestion/entities/ingestion.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, default: "Title Document" })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ type: "int", nullable: false })
    uploadedBy: number;

    @ManyToOne(() => User, (user) => user.documents)
    @JoinColumn({ name: 'uploadedBy' })
    user: User;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Ingestion, (ingestion) => ingestion.document)
    ingestion: Ingestion[];
}
