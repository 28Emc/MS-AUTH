import { PrimaryGeneratedColumn, Column, Entity, UpdateDateColumn, CreateDateColumn } from "typeorm";

export enum UserStatus {
    'ACTIVE' = 'A',
    'INACTIVE' = 'I'
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ name: 'u_id' })
    userId: number;

    @Column({ name: 'u_username', type: 'varchar', length: 255, default: 'No user' })
    username: string;

    @Column({ name: 'u_password', type: 'varchar', length: 255, default: 'No password' })
    password: string;

    @Column({ name: 'u_status', type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @CreateDateColumn({ name: 'u_creation_date', type: 'datetime' })
    creationDate: Date;

    @Column({ name: 'u_created_by', type: 'varchar', length: 255, default: 'admin' })
    createdBy: string;

    @UpdateDateColumn({ name: 'u_modified_date', type: 'datetime', nullable: true })
    modifiedDate: Date;

    @Column({ name: 'u_modified_by', type: 'varchar', length: 255, nullable: true, default: 'admin' })
    modifiedBy: string;
}