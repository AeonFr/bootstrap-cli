import { readFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import { categories as defaultCategories } from '../../bootstrap-cli.json';

interface Category {
	name: string;
	commandTemplate: string;
	actions: {
		name: string;
		commandParams: { [key: string]: string };
	}[];
}

export const getCategories = (): Category[] => {
	let userCategories: Category[] = [];

	try {
		userCategories = JSON.parse(
			readFileSync(resolve(homedir(), './.bootstrap-cli.json'), {
				encoding: 'utf-8',
				flag: 'r',
			})
		)?.categories;
	} catch (e) {
		if (e.code === 'ENOENT') {
			// ignore
		} else {
			throw e;
		}
	}

	return [
		...defaultCategories,
		...userCategories.map((category: any) => {
			// add new actions to default categories
			defaultCategories.forEach((defaultCategory) => {
				if (defaultCategory.name === category.name) {
					category.actions = [...defaultCategory.actions, ...category.actions];
				}
			});
			return category;
		}),
	];
};
