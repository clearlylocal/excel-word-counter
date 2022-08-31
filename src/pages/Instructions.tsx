import { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import instructionsMdUrl from '../content/instructions.md'
import {
	handleLinks,
	prependPublicUrlToRelativeLinks,
	renderAnchors,
	scrollHashIntoView,
} from '../utils/dom'
import { onHtmlRender } from '../utils/react'
import { snarkdown } from '../utils/snarkdown'

export const Instructions: FC = () => {
	const [html, setHtml] = useState('')

	const history = useHistory()

	useEffect(() => {
		fetch(instructionsMdUrl, { cache: 'force-cache' }).then(async (res) => {
			const content = await res.text()

			const html = snarkdown(content)

			setHtml(html)
		})
	}, [])

	return (
		<div
			ref={onHtmlRender((el) => {
				// setup
				renderAnchors(el)
				prependPublicUrlToRelativeLinks(el)
				handleLinks(el, history)

				// effects
				scrollHashIntoView(el)
			})}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
