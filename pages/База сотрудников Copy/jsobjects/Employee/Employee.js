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
		View.setVisibility(true);
	},
	getIDCurrent() {
		if (widget_list_employee.selectedItem !== undefined) {
			storeValue("widget_list_employee_id", widget_list_employee.selectedItem.id);
			return widget_list_employee.selectedItem.id;
		}
		if (appsmith.store.widget_list_employee_id === undefined) {
			return 2;
		}
		return appsmith.store.widget_list_employee_id;
	},
	getCurrent(field, default_text="") {
		if (get_employee && get_employee.data && get_employee.data.length > 0 && field in get_employee.data[0]) {
			return get_employee.data[0][field]==null?default_text:get_employee.data[0][field];
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