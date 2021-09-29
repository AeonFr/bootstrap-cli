import React, { useMemo, useState } from 'react';
import { Text, Box, useInput, useApp } from 'ink';
import { buildCommand } from '../utils/buildCommand';
import { Command } from './Command';
import { getCategories } from '../utils/getCategories';

interface Props {
	onSelectCommand: (event: { command: string }) => void;
	onAddCategory: () => void;
	onAddAction: (event: { selectedCategory: number }) => void;
}

export const CommandSelector: React.FC<Props> = ({
	onSelectCommand,
	onAddCategory,
	onAddAction,
}) => {
	const categories = getCategories();
	const [focusedCategory, setFocusedCategory] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [focusedAction, setFocusedAction] = useState(0);
	const [selectedAction, setSelectedAction] = useState(null);

	const command = useMemo(() => {
		if (selectedCategory === null) {
			return null;
		}

		let commandTemplate = categories[selectedCategory].commandTemplate;
		let replace =
			categories[selectedCategory].actions[focusedAction].commandParams;

		return buildCommand(commandTemplate, replace);
	}, [selectedCategory, focusedAction]);

	const maxActionsCount = Math.max(
		...categories.map((category) => category.actions.length)
	);

	const { exit } = useApp();

	useInput((input, key) => {
		if (input === 'q') {
			exit();
		}

		if (selectedCategory === null) {
			if (key.downArrow) {
				setFocusedCategory(
					Math.min(focusedCategory + 1, categories.length - 1)
				);
			}

			if (key.upArrow) {
				setFocusedCategory(Math.max(focusedCategory - 1, 0));
			}

			if (key.rightArrow || key.return) {
				setSelectedCategory(focusedCategory);
			}
		} else {
			if (key.leftArrow || key.escape) {
				setSelectedCategory(null);
				setFocusedAction(0);
			}

			if (key.downArrow) {
				setFocusedAction(
					Math.min(
						focusedAction + 1,
						categories[selectedCategory].actions.length - 1
					)
				);
			}

			if (key.upArrow) {
				setFocusedAction(Math.max(focusedAction - 1, 0));
			}

			if (key.return) {
				setSelectedAction(focusedAction);

				onSelectCommand({ command });
			}
		}
	});

	return (
		<>
			{selectedAction === null && (
				<Box flexDirection="row" marginBottom={2} marginX={1}>
					<Box flexDirection="column" flexGrow={1}>
						{categories.map((category, i) => {
							return (
								<Item
									key={category.name}
									label={category.name}
									isFocused={focusedCategory === i}
									isDisabled={selectedCategory !== null}
								/>
							);
						})}
					</Box>
					<Box flexDirection="column" minHeight={maxActionsCount} flexGrow={10}>
						{categories[focusedCategory].actions.map((action, i) => {
							return (
								<Item
									key={action.name}
									label={action.name}
									isDisabled={selectedCategory === null}
									isFocused={selectedCategory !== null && i === focusedAction}
								/>
							);
						})}
					</Box>
				</Box>
			)}
			<Box minHeight={2} flexDirection="column">
				{!command ? (
					<Text color="gray">
						Use arrow keys to move between options, enter to select
					</Text>
				) : (
					<Command command={command} />
				)}
			</Box>
		</>
	);
};

interface ItemProps {
	label: string;
	isFocused: boolean;
	isDisabled: boolean;
}

const Item: React.FC<ItemProps> = ({
	label,
	isFocused,
	isDisabled,
	...props
}) => {
	return (
		<Box {...props}>
			<Text
				color="green"
				backgroundColor={isFocused && !isDisabled ? 'blackBright' : ''}
			>
				{isFocused ? '› ' : '  '}
			</Text>
			<Text
				color={!isFocused && isDisabled ? 'gray' : 'white'}
				backgroundColor={isFocused && !isDisabled ? 'blackBright' : ''}
			>
				{label}
			</Text>
		</Box>
	);
};
