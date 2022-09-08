export type Results = {
	countPerUser: Record<
		string, // userEmail
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
