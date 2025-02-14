export function errorUserInput(userInput: {
	representante?: string;
	tlf?: string;
	alumno?: string;
	fecha_nacimiento?: string;
	horario?: string;
}) {
	const errors: {
		error?: string;
		representante?: string;
		tlf?: string;
		alumno?: string;
		fecha_nacimiento?: string;
		horario?: string;
	} = {};

	const regexName = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;
	const regexTlf = /^[0-9]{11}$/;
	const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
	const regexTime = /^(descubrimiento|crecimiento|diversi[oó]n)$/i;

	if (Object.values(userInput).some((value) => value === undefined)) {
		errors['error'] =
			'Faltan datos por completar\nPor favor, ingresa la información solicitada';
		return errors;
	}
	if (!regexName.test(userInput.representante!)) {
		errors['representante'] =
			'El nombre y apellido del representante no es válido\nEjemplo: Juan Perez';
	}

	if (!regexTlf.test(userInput.tlf!)) {
		errors['tlf'] = 'El número de teléfono no es válido\nEjemplo: 04240000000';
	}

	if (!regexName.test(userInput.alumno!)) {
		errors['alumno'] =
			'El nombre y apellido del alumno no es válido\nEjemplo: Juanito Perez';
	}

	if (!regexDate.test(userInput.fecha_nacimiento!)) {
		errors['fecha_nacimiento'] =
			'La fecha de nacimiento no es válida\nEjemplo: 15/06/2010';
	} else {
		// Validar que la fecha sea válida
		const [day, month, year] = userInput.fecha_nacimiento!.split('/').map(Number);
		const fecha = new Date(year, month - 1, day);

		if (
			fecha.getDate() !== day ||
			fecha.getMonth() !== month - 1 ||
			fecha.getFullYear() !== year ||
			year < 1900 ||
			year > new Date().getFullYear()
		) {
			errors['fecha_nacimiento'] = 'La fecha de nacimiento no es real';
		}
	}

	if (!regexTime.test(userInput.horario!)) {
		errors['horario'] = 'El horario no es válido';
	}

	return errors;
}
