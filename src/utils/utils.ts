export const hashWithDefault = <T>(defaultVal: T) =>
	new Proxy(Object.create(null) as Record<string, T>, {
		get(target, key: string) {
			return key in target ? target[key] : defaultVal
		},
	})
