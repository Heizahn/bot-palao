export function MainMenu(title: string) {
	return {
		buttonText: 'Desplegar Menú',
		description: title + '\nPor favor, selecciona una opción.',
		sections: [
			{
				title: '🌟 Servicios Disponibles',
				rows: [
					{
						rowId: '1',
						title: '1️⃣ Información',
						description: 'Conoce nuestro Programa Maternal',
					},
					{
						rowId: '2',
						title: '2️⃣ Horarios',
						description: 'Consulta nuestros horarios flexibles',
					},
					{
						rowId: '3',
						title: '3️⃣ Censo',
						description: 'Registro de nuevos estudiantes',
					},
					{
						rowId: '4',
						title: '4️⃣ Mensualidad',
						description: 'Información sobre costos',
					},
					{
						rowId: '5',
						title: '5️⃣ Salir',
						description: 'Finalizar la conversación',
					},
				],
			},
		],
	};
}

export const messages = {
	info: {
		text:
			`🌟 ¡Descubre el Programa Maternal! 🌟\n\n` +
			`Dirigido a niños y niñas de 1 a 3 años, nuestro programa ofrece un entorno seguro y estimulante donde los pequeños pueden explorar, aprender y crecer. A través de actividades lúdicas y significativas, fomentamos el desarrollo emocional, social y cognitivo, potenciando la autoestima y las habilidades comunicativas.\n\n` +
			`Con rutinas diarias que promueven la disciplina y el desarrollo de hábitos saludables, nuestros educadores guían a los niños en la formación de relaciones positivas y el descubrimiento de su mundo. ¡Dale a tu hijo la base sólida para su futuro educativo y personal!!\n\n` +
			`únete a nuestra comunidad🌈✨👶🧒\n` +
			`Palao Rico Kids\n` +
			`Av Michelena Edif #9-10\n` +
			`Diagonal a la Ferretería Capanaparo`,
	},
	schedule: {
		text:
			`🕒 *Horarios Flexibles*\n\n` +
			`- A1. ✏️🕥🎵Horario de Descubrimiento: De 07:00 AM hasta las 11:30 AM.\n` +
			`- B2. ✏️🕒📈Horario de Crecimiento: De 07:00 AM hasta las 03:00 PM.\n` +
			`- C3. ✏️🕠🥳Horario de Diversión: De 07:00 AM hasta las 05:00 PM.`,
	},
	payment: {
		text: `En estos momentos nos encontramos evaluando la estructura de costo para ofrecerles una Mensualidad accesible 🤝`,
	},
	census: {
		text:
			`📝 *Formulario de Registro*\n\n` +
			`Por favor, proporciona la siguiente información:\n\n` +
			`✏️ Nombre y Apellidos Representante\n` +
			`✏️ Teléfono\n` +
			`✏️ Nombre del Alumno\n` +
			`✏️ Fecha de nacimiento\n` +
			`✏️ Horario Requerido (Descubrimiento, Crecimiento o Diversión)`,
	},
	invalid: `⚠️ Opción no válida. Por favor, selecciona una opción del menú.`,
	goodbye: `👋 ¡Gracias por tu interés! Si tienes más preguntas, no dudes en escribirnos nuevamente.`,
	success: `¡Gracias por tu interés! Nos pondremos en contacto contigo a la brevedad posible.`,
	welcome: `¡Bienvenido a Palao Rico Kids! 🎓`,
	menu: `🌟 ¡Menú Principal! 🌟`,
};

export const backButton = {
	buttonText: '🔙 Volver al Menú',
	description: 'Selecciona para regresar al menú principal',
	sections: [
		{
			title: 'Navegación',
			rows: [
				{
					rowId: 'BACK_TO_MENU',
					title: '🔙 Volver al Menú Principal',
					description: 'Regresar al menú de opciones',
				},
			],
		},
	],
};
