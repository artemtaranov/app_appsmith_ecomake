export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	},
	async getEnumValuesEmployees() {
		try {
			const res = await get_enum_list.run({db:"ecomake"});
			console.log(res); // Проверка структуры результата

			// Проверяем, что получены данные
			if (res && res.length > 0) {
				this.myVar1 = res.reduce((acc, {TABLE_NAME, COLUMN_NAME, enum_values}) => {
					// Обработка строки для получения значений ENUM
					let enumValues = enum_values.replace(/^enum\('/, "").replace(/'\)$/, "").split("','");

					// Проверка и добавление значений ENUM
					if (!acc[TABLE_NAME]) {
						acc[TABLE_NAME] = {};
					}
					acc[TABLE_NAME][COLUMN_NAME] = enumValues.map(value => ({ label: value, value: value }));

					return acc;
				}, {});
				return this.myVar1;
			} else {
				console.error('No data received or data format is incorrect');
				return {};
			}
		} catch (error) {
			console.error('Error fetching enum values:', error);
			return {};
		}
	},
	getEmpl (data) {
		// Объект сопоставления английских имен столбцов с русскими названиями
		const columnNamesMapping = {
			"employee_id": "ID сотрудника",
			"passport_series": "Серия паспорта",
			"passport_number": "Номер паспорта",
			// ... добавьте остальные сопоставления
		};

		// Функция для преобразования названий столбцов
		function mapColumnNames(data) {
			return data.map(row => {
				const mappedRow = {};
				for (let key in row) {
					// Используем сопоставленное название столбца, если оно есть, иначе оставляем как есть
					const newKey = columnNamesMapping[key] || key;
					mappedRow[newKey] = row[key];
				}
				return mappedRow;
			});
		}

		const dataWithRussianColumnNames = mapColumnNames(data);
		return dataWithRussianColumnNames;
	}
}