export function execCommand(command: string) {
	return new Promise((resolve) => {
		var spawn = require('child_process').spawn,
			ls = spawn(command, [], { shell: true, stdio: 'inherit' });

		ls.on('exit', function (code: number) {
			resolve(code);
		});
	});
}
