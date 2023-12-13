export default {
	myVar1: [],
	myVar2: {},
	async employeeStatus(status=null) {
		if(appsmith.store.employee_status && appsmith.store.employee_status[status]){
			return appsmith.store.employee_status[status];
		} else {
			try {
				const result = await status_employee.run();
				storeValue('employee_status', result);
				return result[status] || 0; // Возвращает количество для заданного статуса или 0, если такого статуса нет
			} catch (error) {
				console.error('Error in employeeStatus:', error);
				return 0; // В случае ошибки возвращает 0
			}
		}
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}