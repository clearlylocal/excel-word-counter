import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { parseExcelFiles } from '../core/parseExcelFiles'
import { ResultsDisplay } from '../components/ResultsDisplay'
import { Results } from '../types/Results'
import { config } from '../core/config'

export const getLangName = (fileName: string) => {
	const [before, after] = config.fileNameFormat.split(/\{\{\s*lang\s*\}\}/)

	const beforeIdx = fileName.indexOf(before)
	const beforeEnd = beforeIdx + before.length
	const afterIdx = fileName.indexOf(after, beforeEnd)

	return [beforeIdx, afterIdx].includes(-1)
		? null
		: fileName.slice(beforeEnd, afterIdx)
}

export const Home = () => {
	const { register, watch, handleSubmit } = useForm()

	const changeHandler = (data: any) => {
		localStorage.setItem('form', JSON.stringify(data))
	}

	const files: FileList = useMemo(
		() => watch('file') ?? ([] as any as FileList),
		[watch],
	)

	const [results, setResults] = useState<Results | null>(null)

	useEffect(() => {
		parseExcelFiles(files, config).then(setResults)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files])

	return (
		<>
			<form onChange={handleSubmit(changeHandler)}>
				<label>
					Upload files (XLSX or ZIP)
					<input type='file' name='file' multiple ref={register} />
				</label>
			</form>
			{results ? (
				<div>
					<ResultsDisplay {...{ results }} />
				</div>
			) : null}
		</>
	)
}
