import { buildCommand } from './buildCommand';
import { getCategories } from './CategoriesRepository';

export function resolveCommand(
	categoryName: string,
	commandName: string
): string {
	const categories = getCategories();

	const categoryIndex = categories.findIndex(
		(category) => category.name === categoryName
	);

	if (categoryIndex === -1) {
		throw new Error(
			`There's no category with name "${categoryName}" configured.`
		);
	}

	const commandIndex = categories[categoryIndex].actions.findIndex(
		(action) => action.name === commandName
	);

	if (commandIndex === -1) {
		throw new Error(
			`There's no action "${commandName}" in category "${categoryName}"`
		);
	}

	const commandTemplate = categories[categoryIndex].commandTemplate;
	const commandParams =
		categories[categoryIndex].actions[commandIndex].commandParams;
	return buildCommand(commandTemplate, commandParams);
}
