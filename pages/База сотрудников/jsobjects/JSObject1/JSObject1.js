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