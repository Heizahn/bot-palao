import { AppDataSource } from './db';
import { Cupo } from '../entities/cupo';

type CupoData = Omit<Cupo, 'id' | 'create_at'>;

export async function SaveCupo(data: CupoData) {
	const repository = AppDataSource.getRepository(Cupo);
	try {
		const cupo = repository.create(data);
		cupo.create_at = new Date();

		const res = await repository.save(cupo);

		console.log('Cupo guardado:', res);
	} catch (error) {
		console.error('Error en SaveCupo:', error);
	}
}
