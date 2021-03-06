import { Table, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Match } from "./Match"
import { Player } from "./Player"

@Table()
export class Prono {

    @PrimaryGeneratedColumn({ unique: true })
    id: number;

    @ManyToOne(type => Match, match => match.pronos, { cascadeInsert: true })
    match: Match;

    @Column()
    choice: string;

    @Column({ nullable: true })
    valid: boolean;

    @ManyToOne(type => Player, player => player.pronos, { cascadeInsert: true })
    player: Player;
}
