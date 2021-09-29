export const buildCommand = (
	commandTemplate: string,
	replace: Record<string, string>
) => {
	let command = commandTemplate;

	for (var placeholder in replace) {
		try {
			command = command.replace(`:${placeholder}`, replace[placeholder]);
		} catch (error) {
			throw new Error(`Placeholder ${placeholder} not found in key ${command}`);
		}
	}

	return command;
};
