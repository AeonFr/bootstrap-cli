import React, { useEffect, useMemo, useState } from 'react';
import { Text, Box, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { buildCommand } from '../utils/buildCommand';
import { Command } from './Command';
import {
	getCategories,
	addCategory,
	deleteCategory,
} from '../utils/CategoriesRepository';
import { useMachine } from '@xstate/react';
import { commandSelectorMachine } from '../state-machines/commandSelectorMachine';

interface Props {
	onSelectCommand: (event: { command: string }) => void;
}

export const CommandSelector: React.FC<Props> = ({ onSelectCommand }) => {
	const [state, send] = useMachine(commandSelectorMachine);

	const [categories, setCategories] = useState(getCategories());
	const [focusedCategory, setFocusedCategory] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [focusedAction, setFocusedAction] = useState(0);
	const [selectedAction, setSelectedAction] = useState(null);
	const [categoryName, setCategoryName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const command = useMemo(() => {
		if (
			!categories[selectedCategory] ||
			!categories[selectedCategory].actions[focusedAction]
		)
			return null;

		let commandTemplate = categories[selectedCategory].commandTemplate;
		let replace =
			categories[selectedCategory].actions[focusedAction].commandParams;

		return buildCommand(commandTemplate, replace);
	}, [selectedCategory, focusedAction]);

	const maxActionsCount = Math.max(
		...categories.map((category) => category.actions.length)
	);

	const { exit } = useApp();

	// list categories
	useInput(
		(input, key) => {
			if (key.escape || input === 'q') {
				exit();
			}

			if (key.downArrow || input === 'j') {
				setFocusedCategory(
					Math.min(focusedCategory + 1, categories.length - 1)
				);
			}

			if (key.upArrow || input === 'k') {
				setFocusedCategory(Math.max(focusedCategory - 1, 0));
			}

			if (key.rightArrow || key.return || input === 'l') {
				setSelectedCategory(focusedCategory);
				send('SELECT_CATEGORY');
			}

			if (input === 'a') {
				send('ADD_CATEGORY');
			}

			if (input === 'd') {
				send('DELETE_CATEGORY');
			}
		},
		{ isActive: state.matches('listCategories') }
	);

	// list actions
	useInput(
		(input, key) => {
			if (key.escape || input === 'q') {
				exit();
			}

			if (key.leftArrow || key.escape || input === 'h') {
				send('RETURN');
				setSelectedCategory(null);
				setFocusedAction(0);
			}

			if (key.downArrow || input === 'j') {
				setFocusedAction(
					Math.min(
						focusedAction + 1,
						categories[selectedCategory].actions.length - 1
					)
				);
			}

			if (key.upArrow || input === 'k') {
				setFocusedAction(Math.max(focusedAction - 1, 0));
			}

			if (key.return) {
				setSelectedAction(focusedAction);
				send('SELECT_ACTION');
			}
		},
		{ isActive: state.matches('listActions') }
	);

	// execute command
	useEffect(() => {
		if (state.matches('executeCommand') && command) {
			onSelectCommand({ command });
		}
	}, [state, send, command]);

	// add category
	useInput(
		(input, key) => {
			if (key.escape) {
				setCategoryName('');
				send('RETURN');
			}

			if (key.return) {
				try {
					addCategory(categoryName);
					setCategories(getCategories());
					setCategoryName('');
					send('ADD');
				} catch (error) {
					setErrorMessage(error.message);
					send('ERROR');
				}
			}
		},
		{ isActive: state.matches('addCategory') }
	);

	// delete category
	useInput(
		(input, key) => {
			if (input.toLowerCase() === 'n' || key.escape) {
				send('RETURN');
			}

			if (input.toLowerCase() === 'y' || key.return) {
				try {
					deleteCategory(categories[focusedCategory].name);
					setFocusedCategory(Math.max(focusedCategory - 1, 0));
					setCategories(getCategories());
					send('DELETE');
				} catch (error) {
					setErrorMessage(error.message);
					send('ERROR');
				}
			}
		},
		{ isActive: state.matches('deleteCategory') }
	);

	// category or action error message
	useInput(
		() => {
			setErrorMessage(null);
			send('RETURN');
		},
		{
			isActive:
				state.matches('categoriesErrorMessage') ||
				state.matches('actionsErrorMessage'),
		}
	);

	return (
		<Box flexDirection="column">
			{false === state.matches('executeCommand') && (
				<Box flexDirection="row" padding={2} marginBottom={2}>
					<Box width={10} flexDirection="column" flexShrink={0}>
						{categories.map((category, i) => {
							return (
								<Item
									key={category.name}
									label={category.name}
									isFocused={focusedCategory === i}
									isDisabled={false === state.matches('selectCategory')}
								/>
							);
						})}
					</Box>
					<Box width={24} flexDirection="column" minHeight={maxActionsCount}>
						{categories[focusedCategory].actions.map((action, i) => {
							return (
								<Item
									key={action.name}
									label={action.name}
									isDisabled={false === state.matches('listActions')}
									isFocused={
										state.matches('listActions') && i === focusedAction
									}
								/>
							);
						})}
					</Box>
				</Box>
			)}
			<Box minHeight={2} flexDirection="column">
				{state.matches('listActions') ? (
					!!command ? (
						<Command command={command} />
					) : (
						<Text color="gray">(no command)</Text>
					)
				) : null}

				{state.matches('executeCommand') && (
					<Command
						categoryName={categories[focusedCategory].name}
						actionName={categories[focusedCategory].actions[focusedAction].name}
						command={command}
					/>
				)}

				{state.matches('listCategories') && (
					<>
						<Text color="gray">
							Use cursors to move between options,{' '}
							<Text color="white">return</Text> to select
						</Text>
						{state.matches('listCategories') && (
							<Text color="gray">
								Press <Text color="white">a</Text> to add a category,{' '}
								<Text color="white">d</Text> to delete selected category
							</Text>
						)}
					</>
				)}

				{state.matches('addCategory') && (
					<Box>
						<Text>Category name: </Text>
						<TextInput value={categoryName} onChange={setCategoryName} />
					</Box>
				)}

				{state.matches('deleteCategory') && (
					<Box>
						<Text>
							<Text color="green">?</Text> Are you sure you want to delete
							category{' '}
							<Text color="yellow">{categories[focusedCategory].name}</Text>?
							[Yn]
						</Text>
					</Box>
				)}

				{state.matches('actionsErrorMessage') ||
					(state.matches('categoriesErrorMessage') && (
						<Box flexDirection="column">
							<Text color="red">{errorMessage}</Text>
							<Text color="gray">Press any key to continue</Text>
						</Box>
					))}
			</Box>
		</Box>
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
			<Text color="green">{isFocused ? '› ' : '  '}</Text>
			<Text color={!isFocused && isDisabled ? 'gray' : 'white'}>{label}</Text>
		</Box>
	);
};
