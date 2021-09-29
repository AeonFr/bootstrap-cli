import { createMachine } from 'xstate';

export const commandSelectorMachine = createMachine({
	id: 'commandSelector',
	initial: 'listCategories',
	states: {
		listCategories: {
			on: {
				SELECT_CATEGORY: { target: 'listActions' },
				ADD_CATEGORY: { target: 'addCategory' },
				DELETE_CATEGORY: { target: 'deleteCategory' },
			},
		},
		listActions: {
			on: {
				RETURN: { target: 'listCategories' },
				SELECT_ACTION: { target: 'executeCommand' },
				ADD_ACTION: { target: 'addAction' },
				DELETE_ACTION: { target: 'deleteAction' },
			},
		},
		executeCommand: {
			type: 'final',
		},
		addCategory: {
			on: {
				RETURN: { target: 'listCategories' },
				ADD: { target: 'listCategories' },
				ERROR: { target: 'categoriesErrorMessage' },
			},
		},
		deleteCategory: {
			on: {
				RETURN: { target: 'listCategories' },
				DELETE: { target: 'listCategories' },
				ERROR: { target: 'categoriesErrorMessage' },
			},
		},
		categoriesErrorMessage: {
			on: {
				RETURN: { target: 'listCategories' },
			},
		},
		actionsErrorMessage: {
			on: {
				RETURN: { target: 'listActions' },
			},
		},
		addAction: {
			on: {
				RETURN: { target: 'listActions' },
				ADD: { target: 'listActions' },
				ERROR: { target: 'actionsErrorMessage' },
			},
		},
		deleteAction: {
			on: {
				RETURN: { target: 'listActions' },
				DELETE: { target: 'listActions' },
				ERROR: { target: 'actionsErrorMessage' },
			},
		},
	},
});
