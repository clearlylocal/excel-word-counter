import { FC, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'
import ExcelJS from 'exceljs'
import { parseExcelFiles } from './parseExcelFiles'

export type Results = {
	countPerLinguist: Record<
		string, // linguistEmail
		Record<
			string, // languageCode
			number // wordCount
		>
	>
	rowsCountedPerFile: Record<
		string, // fileName
		number // rowCount
	>
	languages: Record<
		string, // languageCode
		true
	>
}

export const getRows = (sheet: ExcelJS.Worksheet) => {
	let headers: string[]

	const rows: Record<string, string>[] = []

	sheet.eachRow((row, rowNumber) => {
		if (rowNumber === 1) {
			// is header row

			if (Array.isArray(row.values)) {
				headers = row.values.map((x) => String(x).trim())
			} else {
				// todo - handle if necessary
				headers = []
			}
		} else {
			// is body row

			if (!headers) return

			rows.push(
				Object.fromEntries(
					headers
						.map((h, i) => [
							h,
							row.values[i] && String(row.values[i]),
						])
						.filter((x) => x && x[1]),
				),
			)
		}
	})

	return { headers, rows }
}

const init = {
	fileNameFormat: String.raw`Need_Translate_To_{{lang}}_for-`,

	srcCol: 'eng',
	linguistCol: 'user_name',
}

export type Config = typeof init

const stored: Config = {
	...init,
	...JSON.parse(localStorage.getItem('form') ?? '{}'),
}

// TODO
const config = stored

export const getLangName = (fileName: string) => {
	const [before, after] = config.fileNameFormat.split(/\{\{\s*lang\s*\}\}/)

	const beforeIdx = fileName.indexOf(before)
	const beforeEnd = beforeIdx + before.length
	const afterIdx = fileName.indexOf(after, beforeEnd)

	return [beforeIdx, afterIdx].includes(-1)
		? null
		: fileName.slice(beforeEnd, afterIdx)
}

const ResultsDisplay: FC<{ results: Results }> = ({
	results,
}: {
	results: Results
}) => {
	const { countPerLinguist, rowsCountedPerFile } = results

	const languages = Object.keys(results.languages)

	return (
		<div>
			<h2>Rows counted per file</h2>

			<table>
				<thead>
					<tr>
						<th>File</th>
						<th align='right'>Rows counted</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(rowsCountedPerFile).map(
						([file, num], i) => (
							<tr key={i}>
								<td>{file}</td>
								<td align='right'>{num}</td>
							</tr>
						),
					)}
				</tbody>
			</table>

			<hr />

			<h2>Count per linguist</h2>

			<table>
				<thead>
					<tr>
						<th rowSpan={2}>Linguist</th>
						<th colSpan={languages.length} align='right'>
							Languages
						</th>
					</tr>
					<tr>
						{languages.map((l, i) => (
							<th key={i} align='right'>
								{l}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Object.entries(countPerLinguist).map(
						([linguist, langData], i) => (
							<tr key={i}>
								<td>{linguist}</td>
								{languages.map((l, j) => (
									<td key={j} align='right'>
										{langData[l]}
									</td>
								))}
							</tr>
						),
					)}
				</tbody>
			</table>
		</div>
	)
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
