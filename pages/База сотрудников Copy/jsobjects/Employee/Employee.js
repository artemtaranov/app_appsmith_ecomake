export default {
	myVar1: [],
	myVar2: {},
	all_list: [],
	async all_employees () {
		get_all_employees.run().then(function (empl){
			// Сохранение массива сотрудников в глобальное хранилище
			storeValue("all_employees", empl);
		});
	},

	async all_employees_by_id () {
		get_all_employees.run().then(function (empl){
			let all_empl = empl.reduce((acc, employee) => {
				acc[employee.id] = employee;
				return acc;
			}, {});
			storeValue("all_employees", all_empl);


		});
	},
	async getPositionsHierarchy() {
		try {
			const res = await list_positions.run();
			if (res && res.length > 0) {
				// Функциональное выражение для построения иерархии
				const buildHierarchy = (positions, parentId = null) => {
					return positions
						.filter(position => position.parent_id === parentId)
						.map(position => ({
						label: position.title,
						value: position.id,
						children: buildHierarchy(positions, position.id)
					}));
				};

				// Создаем иерархическую структуру
				return buildHierarchy(res);
			} else {
				console.error('No data received or data format is incorrect');
				return [];
			}
		} catch (error) {
			console.error('Error fetching position hierarchy:', error);
			return [];
		}
	},
	updateData(){
		let combinedObject = {
			...JSONFormEmployees_general.formData,
			...JSONFormEmployees_contract.formData,
			...JSONFormEmployees_sensitive.formData,
			...JSONFormEmployees_system.formData
		};

		// Замена всех undefined значений на пустые строки
		Object.keys(combinedObject).forEach(key => {
			if (combinedObject[key] === undefined) {
				combinedObject[key] = null;
			}
		});
		update_employee.run({id:get_employee.data[0].id, data: combinedObject}).then(function(){
			get_employee.run({id:get_employee.data[0].id});
			list_employee.run();
			showAlert('Изменения сохранены');

		});
	},
	updatePosition(){

		update_employee_position.run({id:get_employee.data[0].id, position_id: FormEmployeePosition.selectedOptionValue }).then(function(){
			get_employee.run({id:get_employee.data[0].id});
			list_employee.run();
			showAlert('Изменения сохранены');

		})
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