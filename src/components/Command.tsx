import React from 'react';
import { Text } from 'ink';

interface CommandProps {
	command: string;
}
export const Command: React.FC<CommandProps> = ({ command }) => {
	return (
		<Text color="gray">
			› <Text color="yellow">{command}</Text>
		</Text>
	);
};
