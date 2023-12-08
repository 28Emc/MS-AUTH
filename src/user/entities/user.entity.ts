import { PrimaryGeneratedColumn, Column, Entity, UpdateDateColumn, CreateDateColumn } from "typeorm";

export enum UserStatus {
    'ACTIVE' = 'A',
    'INACTIVE' = 'I'
}

export enum LoginModes {
    'DEFAULT' = 1,
    'GOOGLE' = 2
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ name: 'u_id' })
    userId: number;

    @Column({ name: 'u_username', type: 'varchar', length: 255, default: 'No user' })
    username: string;

    @Column({ name: 'u_password', type: 'varchar', length: 255, default: 'No password' })
    password: string;

    @Column({ name: 'u_picture', type: 'text' })
    picture: string;

    @Column({ name: 'u_first_name', type: 'varchar', length: 255, nullable: true })
    firstName: string;

    @Column({ name: 'u_last_name', type: 'varchar', length: 255, nullable: true })
    lastName: string;

    @Column({ name: 'u_status', type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ name: 'u_flg_mode', type: 'enum', enum: LoginModes, default: LoginModes.DEFAULT })
    flgLogin: LoginModes;

    @CreateDateColumn({ name: 'u_creation_date', type: 'datetime' })
    creationDate: Date;

    @Column({ name: 'u_created_by', type: 'varchar', length: 255, default: 'admin' })
    createdBy: string;

    @UpdateDateColumn({ name: 'u_modified_date', type: 'datetime', nullable: true })
    modifiedDate: Date;

    @Column({ name: 'u_modified_by', type: 'varchar', length: 255, nullable: true, default: 'admin' })
    modifiedBy: string;
}