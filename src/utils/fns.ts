export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: (a: A) => B): B
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
export function pipe<A, B, C, D>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
): D
export function pipe<A, B, C, D, E>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
): E
export function pipe<A, B, C, D, E, F>(
	a: A,
	ab: (a: A) => B,
	bc: (b: B) => C,
	cd: (c: C) => D,
	de: (d: D) => E,
	ef: (e: E) => F,
): F
export function pipe(init: any, ...fns: any[]) {
	return fns.reduce((val, fn) => fn(val), init)
}

export function pipeNullable<A>(a: A): A
export function pipeNullable<A, B>(
	a: A,
	ab: (a: NonNullable<A>) => B,
): NonNullable<B>
export function pipeNullable<A, B, C>(
	a: A,
	ab: (a: NonNullable<A>) => B,
	bc: (b: NonNullable<B>) => C,
): NonNullable<C>
export function pipeNullable<A, B, C, D>(
	a: A,
	ab: (a: NonNullable<A>) => B,
	bc: (b: NonNullable<B>) => C,
	cd: (c: NonNullable<C>) => D,
): NonNullable<D>
export function pipeNullable<A, B, C, D, E>(
	a: A,
	ab: (a: NonNullable<A>) => B,
	bc: (b: NonNullable<B>) => C,
	cd: (c: NonNullable<C>) => D,
	de: (d: NonNullable<D>) => E,
): NonNullable<E>
export function pipeNullable<A, B, C, D, E, F>(
	a: A,
	ab: (a: NonNullable<A>) => B,
	bc: (b: NonNullable<B>) => C,
	cd: (c: NonNullable<C>) => D,
	de: (d: NonNullable<D>) => E,
	ef: (e: NonNullable<E>) => F,
): NonNullable<F>
export function pipeNullable(init: any, ...fns: any[]) {
	return fns.reduce((val, fn) => (val == null ? val : fn(val)), init)
}

export const permute =
	<T>(arr: T[]) =>
	(arrOfArrs: T[][]) =>
		arr.flatMap((x) => arrOfArrs.map((a) => [...a, x]))
