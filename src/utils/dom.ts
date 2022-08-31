import { useHistory } from 'react-router-dom'
import { pipe } from './fns'
import { slugify } from './formatters'
import { hashWithDefault } from './utils'

export const renderAnchors = (el: HTMLElement) => {
	const slugs = hashWithDefault(0)

	for (const heading of el.querySelectorAll(
		'h2, h3, h4, h5, h6, .anchored',
	)) {
		if (heading.textContent) {
			const slug = slugify(heading.textContent) || 'heading'

			const x = ++slugs[slug]

			heading.id = [slug, x > 1 && x].filter(Boolean).join('-')
			heading.classList.add('anchored')
		}
	}
}

export const prependPublicUrlToRelativeLinks = (el: HTMLElement) => {
	for (const link of el.querySelectorAll('a')) {
		const href = link.getAttribute('href')

		if (href?.startsWith('/')) {
			link.setAttribute('href', process.env.PUBLIC_URL + href)
		}
	}
}

export const handleLinks = (
	el: HTMLElement,
	history: ReturnType<typeof useHistory>,
) => {
	el.addEventListener('click', (e) => {
		const target = e.target as HTMLAnchorElement
		const href = target.getAttribute('href')

		if (target.nodeName === 'A' && href) {
			e.preventDefault()

			if (
				href.startsWith('http') &&
				!href.startsWith(window.location.origin)
			) {
				window.open(href, '_blank', 'noopener noreferrer')
			} else {
				history.push(href.slice(process.env.PUBLIC_URL.length))
			}
		} else if (target.classList.contains('anchored')) {
			window.location.hash = target.id
			target.scrollIntoView(true)
		}
	})
}

export const scrollHashIntoView = (el: HTMLElement) => {
	if (window.location.hash) {
		setTimeout(() => {
			const matchedEl = pipe(
				window.location.hash.slice(1),
				decodeURIComponent,
				CSS.escape,
				(id) => el.querySelector(`#${id}`),
			)

			matchedEl?.scrollIntoView(true)
			// 100ms to counteract browser position retaining
		}, 100)
	}
}
