import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum typeTurn {
	DESCUBRIMIENTO = 'descubrimiento',
	CRECIMIENTO = 'crecimiento',
	DIVERSION = 'diversión',
}

@Entity()
export class Cupo {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('timestamp')
	create_at: Date;

	@Column('text')
	representante: string;

	@Column('text')
	tlf: string;

	@Column('text')
	tlf_registro: string;

	@Column('text')
	alumno: string;

	@Column('text')
	fecha_nacimiento: string;

	@Column({
		type: 'enum',
		enum: typeTurn,
	})
	horario: typeTurn;
}
