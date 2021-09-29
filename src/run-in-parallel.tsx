import React, { useEffect, useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import { FullScreen } from './components/FullScreen';
import { spawn } from 'child_process';

const CommandOutput: React.FC<{ command: string }> = (props) => {
	const [data, setData] = useState<string[]>([]);
	const [offset, setOffset] = useState<number>(0);
	const maxOutputLines = process.stdout.rows / 2 - 4;

	useEffect(() => {
		const ls = spawn(props.command, [], {
			shell: true,
			stdio: 'pipe',
		});

		const addLine = (line: string) => {
			if (line.startsWith('<s>')) {
				setData([line.split('\n')[line.split('\n').length - 1]]);
			} else {
				setData((d) => [
					...d.slice(Math.max(0, d.length - maxOutputLines * 3)),
					...line.split('\n'),
				]);
			}
			setOffset(0);
		};

		ls.stdout.on('data', function (data: string) {
			addLine(data.toString());
		});

		ls.stderr.on('data', function (data: string) {
			addLine(data.toString());
		});

		ls.on('exit', function (code: string) {
			addLine('Child process exited with code ' + code?.toString());
		});

		() => ls.kill();
	}, []);

	useInput((input, key) => {
		if (key.upArrow) {
			setOffset((o) => o - 1);
		}
		if (key.downArrow) {
			setOffset((o) => Math.max(0, o + 1));
		}
	});

	const sliceStart = Math.max(0, data.length - maxOutputLines + offset);
	const sliceEnd = Math.max(data.length - 1 + offset, data.length - 1);

	return (
		<>
			<Box width="100%" paddingLeft={1} paddingTop={1} paddingBottom={1}>
				<Text wrap="truncate-end" color="whiteBright">
					{props.command}
				</Text>
			</Box>
			<Box height="100%" flexDirection="column" width="100%">
				{data.slice(sliceStart, sliceEnd).map((line) => (
					<Text wrap="truncate-end">{line}</Text>
				))}
			</Box>
		</>
	);
};

const App: React.FC<{}> = () => {
	const command1 = process.argv[2];
	const command2 = process.argv[3];

	return (
		<FullScreen>
			<Box flexDirection="column" width="100%">
				<Box flexDirection="column" width="100%" height="50%" padding={1}>
					<CommandOutput command={command1} />
				</Box>
				<Box flexDirection="column" width="100%" height="50%" padding={1}>
					<CommandOutput command={command2} />
				</Box>
			</Box>
		</FullScreen>
	);
};

render(<App />);
