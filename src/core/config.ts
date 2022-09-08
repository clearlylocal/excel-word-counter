const init = {
	fileNameFormat: String.raw`Need_Translate_To_{{lang}}_for-`,

	srcCol: 'eng',
	userCol: 'user_name',
}

export type Config = typeof init

const stored: Config = {
	...init,
	...JSON.parse(localStorage.getItem('form') ?? '{}'),
}

// TODO
export const config = stored
