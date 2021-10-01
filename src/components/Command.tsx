import React from 'react';
import { Box, Text, Spacer } from 'ink';

interface CommandProps {
	categoryName?: string;
	actionName?: string;
	command: string;
}
export const Command: React.FC<CommandProps> = ({
	categoryName,
	actionName,
	command,
}) => {
	return (
		<Box flexDirection="column">
			{categoryName && actionName && (
				<Text color="gray">
					› bootstrap {categoryName} {actionName}
				</Text>
			)}
			<Text color="cyan">› {command}</Text>
		</Box>
	);
};
