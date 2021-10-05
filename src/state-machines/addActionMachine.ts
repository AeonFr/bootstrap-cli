import { createMachine } from 'xstate';

export const addActionMachine = createMachine({
	id: 'addAction',
	initial: 'inputActionName',
	states: {
		inputActionName: {
			on: {
				CONFIRM: 'inputActionCommand',
				EXIT: 'exit',
			},
		},
		inputActionCommand: {
			on: {
				BACK: 'inputActionName',
				CONFIRM: 'submit',
				EXIT: 'exit',
			},
		},
		submit: {
			type: 'final',
		},
		exit: {
			type: 'final',
		},
	},
});
