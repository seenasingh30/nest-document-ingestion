import { Role } from "../../common/enums/role.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Document } from "../../document/entities/document.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    firstName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    lastName: string;


    @Column({ type: 'varchar', length: 255, unique: true, default: '' })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.Viewer,
    })
    role: Role;

    @OneToMany(() => Document, (document) => document.user)
    documents: Document[];
}
