# Bootstrap CLI

A CLI to organize and alias bash commands

## Installation / Updating

```
npm install -g bootstrap-cli
```

## Usage

List all categories and actions (load the GUI)

```
bootstrap
```

Shortcut to execute an action without loading the GUI

```
bootstrap <category> <action>
```

Show this document

```
bootstrap help
```

## Add custom commands

You can add custom categories and actions, that will be shown in the command list and that can be accessed via aliases. To add your own categories and actions, create a `~/.bootstrap-cli.json` file.

This is an example to add a `bootstrap myproject start` and `bootstrap myproject stop` command.

```json
{
	"categories": [
		{
			"name": "make",
			"commandTemplate": "cd ~/Sites/myproject && :project_command",
			"actions": [
				{
					"name": "start",
					"commandParams": { "project_command": "npm run start" }
				},
				{
					"name": "stop",
					"commandParams": { "project_command": "npm run stop" }
				}
			]
		}
	]
}
```

In the example above, notice that `:project_command` in the Category's `commandTemplate` is replaced by the contents of the Action's `commandParams.project_command` object.
