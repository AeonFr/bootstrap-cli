import React from 'react';
import { useApp, useStdin, Box, Text } from 'ink';
import { CommandSelector } from './components/CommandSelector';
import { execCommand } from './utils/execCommand';

export const CommandSelectorWrapped = () => {
	const { exit } = useApp();
	const { isRawModeSupported } = useStdin();

	React.useEffect(() => {
		if (!isRawModeSupported) {
			exit(new Error('Raw mode not supported'));
		}
	}, []);

	const onSelectCommand = ({ command }: { command: string }) => {
		execCommand(command).then(exit);
	};

	if (!isRawModeSupported) {
		return (
			<Box width="64" flexDirection="column">
				<Text>{`CommandSelector not supported in Raw mode:`}</Text>
				<Text>{`‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                  ‾‾‾‾‾‾‾‾`}</Text>
				<Text>
					The App can't initialize because your console is in raw mode
				</Text>
			</Box>
		);
	}

	return <CommandSelector onSelectCommand={onSelectCommand} />;
};
