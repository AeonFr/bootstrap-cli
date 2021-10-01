import { readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import { categories as defaultCategories } from '../../bootstrap-cli.json';

const USER_CONFIG_FILE = resolve(homedir(), './.bootstrap-cli.json');

interface Category {
	name: string;
	commandTemplate: string;
	actions: {
		name: string;
		commandParams: { [key: string]: string };
	}[];
}

export const getCategories = (): Category[] => {
	const userCategories: Category[] = getUserCategories();

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

const getUserCategories = (): Category[] => {
	let userCategories: Category[] = [];

	try {
		userCategories = JSON.parse(
			readFileSync(USER_CONFIG_FILE, {
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

	return userCategories;
};

export const addCategory = (name: string) => {
	const userCategories = getUserCategories();

	if (userCategories.some((category) => category.name === name)) {
		throw new Error(`Category "${name}" already exists.`);
	}

	if (!name || /[^a-zA-Z0-9_-]/.test(name)) {
		throw new Error(
			`Category name can only contain letters, numbers and dashes or underscores.`
		);
	}

	writeToUserConfig({
		categories: [
			...userCategories,
			{
				name,
				commandTemplate: ':command',
				actions: [],
			},
		],
	});
};

const writeToUserConfig = (data: { categories: Category[] }) => {
	writeFileSync(USER_CONFIG_FILE, JSON.stringify(data, null, 2));
};

export const deleteCategory = (name: string) => {
	const userCategories = getUserCategories();

	if (!userCategories.some((category) => category.name === name)) {
		throw new Error(
			`Category "${name}" could not be deleted because it does not exist. (Hint: Do you have multiple console tabs opened? Maybe it has been deleted already in a different tab).`
		);
	}
	writeToUserConfig({
		categories: userCategories.filter((category) => category.name !== name),
	});
};
