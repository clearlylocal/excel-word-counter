import { default as _snarkdown } from 'snarkdown'

export const snarkdown = (md: string) => {
	const html = md
		.split(/((?<=^|\n)```\r?\n[\s\S]*?\r?\n```)/)
		.map((m, i) =>
			i % 2
				? `<pre><code>${m
						.split(/\r?\n/)
						.slice(1, -1)
						.join('\n')}</pre></code>`
				: m
						.split(/(?:\r?\n){2,}/)
						.map((l) => {
							if (
								[' ', '\t', '#', '-', '*', '`', '~'].some(
									(ch) => l.startsWith(ch),
								)
							) {
								return /^\s*-{3,}\s*$/.test(l)
									? `<hr>`
									: _snarkdown(l)
							} else {
								return `<p>${_snarkdown(l)}</p>`
							}
						})
						.join(''),
		)
		.join('')
		.replace(/<p><\/p>/g, '')

	return html
}
