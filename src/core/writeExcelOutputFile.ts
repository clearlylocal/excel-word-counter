import ExcelJS from 'exceljs'
import { Results } from '../types/Results'

const resultsToWorkbook = (results: Results) => {
	const { countPerUser, rowsCountedPerFile } = results
	const languages = Object.keys(results.languages)

	const workbook = new ExcelJS.Workbook()

	// word counts
	{
		const sheet = workbook.addWorksheet('Wordcounts', {
			views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }],
		})

		const cols = languages.length + 1

		sheet.autoFilter = {
			from: {
				row: 2,
				column: 1,
			},
			to: {
				row: 2,
				column: cols,
			},
		}

		sheet.getRow(1).values = ['User', 'Languages']
		sheet.getRow(2).values = ['', ...languages]

		for (const row of [1, 2]) {
			sheet.getRow(row).font = { bold: true }
		}

		sheet.mergeCells('A1:A2')
		sheet.mergeCells(1, 2, 1, cols)

		sheet.getCell('B1').alignment = { horizontal: 'right' }

		sheet.getColumn('A').width = 30

		for (const [i, [user, langData]] of Object.entries(
			countPerUser,
		).entries()) {
			sheet.getRow(3 + i).values = [
				user,
				...languages.map((l) => langData[l]),
			]
		}
	}

	// stats
	{
		const sheet = workbook.addWorksheet('Stats', {
			views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
		})

		sheet.getRow(1).values = ['File', 'Rows counted']
		sheet.getRow(1).font = { bold: true }

		sheet.getColumn('A').width = 65

		for (const [i, [file, rowsCounted]] of Object.entries(
			rowsCountedPerFile,
		).entries()) {
			sheet.getRow(2 + i).values = [file, rowsCounted]
		}
	}

	return workbook
}

export async function writeExcelOutputFile(results: Results) {
	const workbook = resultsToWorkbook(results)

	const buf = await workbook.xlsx.writeBuffer({})

	const a = document.createElement('a')
	const outFile = new Blob([buf], {
		type: 'image/jpeg',
	})

	a.href = URL.createObjectURL(outFile)
	a.download = `wordcounts_${new Date()
		.toISOString()
		.replace(/\D/g, '')}.xlsx`

	a.click()
}
