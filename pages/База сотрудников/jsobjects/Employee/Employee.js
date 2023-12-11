export default {
	myVar1: [],
	myVar2: {},
	all_list: [],
	onloadfunc(){
		this.all_employees();
		this.getPositionsHierarchy();
		this.getIDCurrent(); 
	},

	create(baseFields){ 
		console.log(baseFields);
	},

	getValueOrDefault(fieldName, params) {
		// Проверяем, существует ли params и params.data
		if (params && params.data) {
			// Проверяем, существует ли поле и не является ли оно пустой строкой
			if (fieldName in params.data && params.data[fieldName] !== '') {
				return params.data[fieldName];
			}
		}
		// Возвращаем значение по умолчанию, если поле отсутствует или содержит пустую строку
		return Employee.getCurrent(fieldName, null);
	},
	async all_employees () {
		get_all_employees.run().then(function (empl){
			// Сохранение массива сотрудников в глобальное хранилище
			storeValue("all_employees", empl);

			let all_empl = empl.reduce((acc, employee) => {
				acc[employee.id] = employee;
				return acc;
			}, {});
			storeValue("all_employees_by_id", all_empl);
			let simplifiedEmpl = empl.map(employee => ({
				id: employee.id,
				short_name: employee.short_name || '',
				surname: employee.surname || '', // Предполагая, что пустая строка является подходящим значением по умолчанию
				name: employee.name || '',
				patronymic: employee.patronymic || '',
				position: employee.position || '',
				employee_status: employee.employee_status || '',
				legal_entity: employee.legal_entity || '',
				contract_type: employee.contract_type || '',
				hiring_date: employee.hiring_date || '', // Проверьте формат даты
				telegram: employee.telegram || '' // Если это поле доступно
			}));
			storeValue("list_all_employees_storage", simplifiedEmpl);

		});
	},

	list_all_employees(searchText = '', selectedStatuses = []) {
		// Получение всех сотрудников
		let empl = appsmith.store.list_all_employees_storage || [];

		// Фильтрация массива сотрудников
		let filteredEmployees = empl.filter(employee => {
			// Проверка на соответствие тексту (если текст предоставлен)
			let matchesText = searchText === '' || employee.id.toString().includes(searchText.toLowerCase()) || employee.surname.toLowerCase().includes(searchText.toLowerCase())||  employee.name.toLowerCase().includes(searchText.toLowerCase()) || (employee.patronymic && employee.patronymic.toLowerCase().includes(searchText.toLowerCase())) || (employee.contract_type && employee.contract_type.toLowerCase().includes(searchText.toLowerCase())) || (employee.legal_entity && employee.legal_entity.toLowerCase().includes(searchText.toLowerCase())) || (employee.position && employee.position.toLowerCase().includes(searchText.toLowerCase()));

			// Проверка на соответствие статусу сотрудника (если статусы предоставлены)
			let matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(employee.employee_status);

			return matchesText && matchesStatus;
		});
		// Возвращение отфильтрованных сотрудников с ограниченным набором полей
		return filteredEmployees;
	},

	async all_employees_by_id () {
		get_all_employees.run().then(function (empl){



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
			if (combinedObject[key] === undefined || combinedObject[key] === '') {
				combinedObject[key] = null;
			}
		});
		update_employee.run({id:Employee.getCurrent('id'), data: combinedObject}).then(function(){
			Employee.all_employees();
			showAlert('Изменения сохранены');

		});
	},
	updatePosition(){

		update_employee_position.run({id:Employee.getCurrent('id'), position_id: FormEmployeePosition.selectedOptionValue }).then(function(){
			Employee.all_employees();

			showAlert('Изменения сохранены');

		})
	},

	getIDCurrent() {
		if (widget_list_employee.selectedItem !== undefined) {
			storeValue("widget_list_employee_id", widget_list_employee.selectedItem.id, true);
			return widget_list_employee.selectedItem.id;
		}

		if (appsmith.store.widget_list_employee_id === undefined) {
			storeValue("widget_list_employee_id", 2);

			return 2;
		}
		return appsmith.store.widget_list_employee_id;
	},
	getCurrent(field, default_text="") {
		if(!appsmith.store.all_employees_by_id || appsmith.store.all_employees_by_id[appsmith.store.widget_list_employee_id][field]==null) return default_text;

		return appsmith.store.all_employees_by_id[appsmith.store.widget_list_employee_id][field];

	},
	getCurrent_backup(field, default_text="") {
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