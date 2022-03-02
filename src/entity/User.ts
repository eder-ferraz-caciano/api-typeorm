import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { HelperColumnsSoftModel } from '../helper/HelperColumnsSoftModel';

@Entity()
export class User extends HelperColumnsSoftModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column()
    ativo: number;

}
