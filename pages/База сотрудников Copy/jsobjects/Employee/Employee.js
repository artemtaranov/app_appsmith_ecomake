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
	async getPositionsHierarchy() {
    try {
        const res = await list_positions.run();
        if (res && res.length > 0) {
            // Функция для построения иерархии
            function buildHierarchy(positions, parentId = null) {
                return positions
                    .filter(position => position.parent_id === parentId)
                    .map(position => ({
                        label: position.title,
                        value: position.id,
                        children: buildHierarchy(positions, position.id)
                    }));
            }

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