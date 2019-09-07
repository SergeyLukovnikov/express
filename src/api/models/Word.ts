import {IsNotEmpty} from 'class-validator';
import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from './User';

@Entity()
export class Word {

    @PrimaryColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @Column()
    public translation: string;

    @Column({
        name: 'user_id',
        nullable: true,
    })
    public userId: string;

    @ManyToOne(type => User, user => user.words)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    public toString(): string {
        return `${this.name}`;
    }

}
