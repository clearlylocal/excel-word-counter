export const onHtmlRender =
	(callback: (parentEl: HTMLElement) => void) =>
	(parentEl: HTMLElement | null) => {
		if (!parentEl) return

		const observer = new MutationObserver((m) => {
			callback(parentEl)

			observer.disconnect()
		})

		observer.observe(parentEl, { childList: true })
	}
