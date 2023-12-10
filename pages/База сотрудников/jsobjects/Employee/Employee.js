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
		Container2.setVisibility(true);
	},
	async fetch(id=0) {
		if(!appsmith.store.hasOwnProperty('employees_data')){
			await get_employees.run()
			let employees =get_employees.data;
			var transformedEmployees = {};
			console.info(employees);
			employees.forEach(employee => {
				transformedEmployees[employee.id] = employee;
			});
			await storeValue("employees_data", transformedEmployees);

		}
		if(id)           
			return appsmith.store.employees_data[id];
		else
			return appsmith.store.employees_data;
	},
	getCurrent: async (field, default_text="") =>{
		let current_employee = await this.fetch(4);
		console.log(current_employee);
		if ( field in current_employee) {
			return current_employee[field]==null?default_text:current_employee[field];
		} else {
			console.error("Данных нет или "+field+" не существует");
			return default_text;
		}
	},

	getColorByStatus(status) {
		switch (status) {
			case 'Работает':
				return '#15803d';
			case 'Увольняется':
				return '#a16207';
			case 'Исп. срок':
				return '#7e22ce';
			case 'Уволен':
				return '#be185d';
			default:
				return '';
		}
	}

}