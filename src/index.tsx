#! /usr/bin/env node
import React from 'react';
import { render, useApp, Text } from 'ink';
import { execCommand } from './utils/execCommand';
import { resolveCommand } from './utils/resolveCommand';
import { Help } from './Help';
import { CommandSelectorWrapped } from './CommandSelectorWrapped';
import { Command } from './components/Command';

const categoryName = process.argv[2];
const actionName = process.argv[3];

const App: React.FC = () => {
	const { exit } = useApp();

	if ((categoryName === 'help' || categoryName === '--help') && !actionName) {
		return <Help />;
	} else if (categoryName && !actionName) {
		process.exitCode = 50;
		setTimeout(exit, 0);
		return <Text color="red">0 or 2 arguments expected, only 1 provided</Text>;
	} else if (categoryName && actionName) {
		try {
			const command = resolveCommand(categoryName, actionName);
			setTimeout(() => {
				exit();
				execCommand(command);
			}, 0);
			return (
				<Command
					categoryName={categoryName}
					actionName={actionName}
					command={command}
				/>
			);
		} catch (error) {
			// Show command not found errors
			process.exitCode = 100;
			setTimeout(exit, 0);
			return <Text color="red">{error.message}</Text>;
		}
	} else {
		return <CommandSelectorWrapped />;
	}
};

render(<App />);
