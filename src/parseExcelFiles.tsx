import ExcelJS from 'exceljs'
import { countWords } from './wordCount'
import { Config, Results, getLangName, getRows } from './pages/Home'
import JSZip from 'jszip'

// debug
;(window as any).countWords = countWords

const flattenUnzip = async (files: FileList | File[]) => {
	const all = await Promise.all(
		[...files].map(async (file) => {
			if (file.type === 'application/x-zip-compressed') {
				const zip = await JSZip.loadAsync(file)

				const files: File[] = []

				for (const zobj of Object.values(zip.files)) {
					if (zobj.dir) continue

					const zblob = await zobj.async('blob')

					const zfile = new File([zblob], zobj.name, {
						lastModified: zobj.date.getTime(),
						type: 'xxx/xxx', // TODO
					})

					files.push(zfile)
				}

				return files
			}

			return file
		}),
	)

	return all.flat()
}

export async function parseExcelFiles(
	files: FileList | File[],
	config: Config,
): Promise<Results | null> {
	if (!files.length) return null

	const results: Results = {
		countPerUser: {},
		rowsCountedPerFile: {},
		languages: {},
	}

	files = await flattenUnzip(files)

	await Promise.all(
		[...files].map(
			(file) =>
				new Promise<void>((res) => {
					const langCode = getLangName(file.name)

					results.rowsCountedPerFile[file.name] = 0

					if (!langCode) {
						return res()
					}

					const reader = new FileReader()

					reader.onloadend = () => {
						const arrayBuffer = reader.result as ArrayBuffer

						const workbook = new ExcelJS.Workbook()

						workbook.xlsx.load(arrayBuffer).then((workbook) => {
							workbook.worksheets.forEach((sheet) => {
								const { headers, rows } = getRows(sheet)

								if (
									headers &&
									[config.userCol, config.srcCol].every((x) =>
										headers.includes(x),
									)
								) {
									for (const row of rows) {
										// if (!row[langCode]) {
										// 	continue
										// }

										const wordCount = countWords(
											row[config.srcCol],
										)

										if (!wordCount) {
											continue
										}

										results.countPerUser[
											row[config.userCol]
										] = {
											...results.countPerUser[
												row[config.userCol]
											],
											[langCode]:
												(results.countPerUser[
													row[config.userCol]
												]?.[langCode] ?? 0) + wordCount,
										}

										results.languages[langCode] = true

										results.rowsCountedPerFile[
											file.name
										] += 1
									}
								}
							})

							return res()
						})
					}

					reader.readAsArrayBuffer(file)
				}),
		),
	)

	return results
}
