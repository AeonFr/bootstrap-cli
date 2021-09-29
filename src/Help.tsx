import React from 'react';
import Markdown from 'ink-markdown';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const Help = () => {
	const readmeContent = readFileSync(resolve(__dirname, '../README.md'), {
		encoding: 'utf8',
		flag: 'r',
	});
	return <Markdown>{readmeContent}</Markdown>;
};
