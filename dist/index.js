"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("@effect/cli");
const platform_node_1 = require("@effect/platform-node");
const effect_1 = require("effect");
const child_process_1 = require("child_process");
const executeCommand = (cmd, cwd) => {
    return effect_1.Effect.tryPromise(() => new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.log("Error occurred executing command:", error);
                reject(stderr);
            }
            else {
                resolve(stdout);
            }
        });
    }));
};
const echoPastedText = ({ text }) => effect_1.Effect.gen(function* (_) {
    yield* _(executeCommand(`echo ${text}`, process.cwd()));
});
const text = cli_1.Args.text({ name: "text" });
const program = cli_1.Command.make("Echo pasted string", { text }, echoPastedText);
const cli = cli_1.Command.run(program, {
    name: "Patchwork CLI",
    version: "v1.0.0",
});
cli(process.argv).pipe(effect_1.Effect.provide(platform_node_1.NodeContext.layer), platform_node_1.NodeRuntime.runMain);
//# sourceMappingURL=index.js.map