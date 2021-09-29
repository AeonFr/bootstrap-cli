#! /usr/bin/env node
import React from 'react';
import { render, useApp } from 'ink';
import { execCommand } from './utils/execCommand';
import { resolveCommand } from './utils/resolveCommand';
import { Help } from './Help';
import { CommandSelectorWrapped } from './CommandSelectorWrapped';

const repoName = process.argv[2];
const commandName = process.argv[3];

const App: React.FC = () => {
	const { exit } = useApp();

	if ((repoName === 'help' || repoName === '--help') && !commandName) {
		return <Help />;
	} else if (repoName && !commandName) {
		// 0 or 2 arguments expected, only 1 provided
		return <Help />;
	} else if (repoName && commandName) {
		// bootstrap-cli {repo} {command}
		try {
			exit();
			const command = resolveCommand(repoName, commandName);
			execCommand(command);
		} catch (error) {
			exitWithError(error.message);
		}
	} else {
		return <CommandSelectorWrapped />;
	}
};

function exitWithError(message: string) {
	console.log(`\x1b[31mERROR: ` + message + `\x1b[0m`);
	process.exit(404);
}

render(<App />);
