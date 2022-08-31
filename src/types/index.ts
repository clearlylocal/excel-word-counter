export type JsonPrimitive = null | string | number | boolean

export type JsonSerializable =
	| JsonPrimitive
	| JsonSerializable[]
	| Partial<{
			[key: string]: JsonSerializable
	  }>
