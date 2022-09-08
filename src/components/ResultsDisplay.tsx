import { useCallback } from 'react'
import { writeExcelOutputFile } from '../core/writeExcelOutputFile'
import { Results } from '../types/Results'

export function ResultsDisplay({ results }: { results: Results }) {
	const { countPerUser, rowsCountedPerFile } = results

	const languages = Object.keys(results.languages)

	const exportToFile = useCallback(() => {
		writeExcelOutputFile(results)
	}, [results])

	return (
		<div>
			<br />
			<button className='button primary' onClick={exportToFile}>
				Export
			</button>

			<h2>Rows counted per file</h2>

			<div className='table-scroller table-scroller-y'>
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
			</div>

			<hr />

			<h2>Word count per user</h2>

			<div /* className='table-scroller table-scroller-x' */>
				<table>
					<thead>
						<tr>
							<th rowSpan={2}>User</th>
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
						{Object.entries(countPerUser).map(
							([user, langData], i) => (
								<tr key={i}>
									<td>{user}</td>
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
		</div>
	)
}
