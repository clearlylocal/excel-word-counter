import ExcelJS from 'exceljs'

export function getRows(sheet: ExcelJS.Worksheet) {
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
