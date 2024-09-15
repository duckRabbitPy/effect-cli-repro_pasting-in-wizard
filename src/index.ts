import { Args, Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect";
import { exec } from "child_process";

const executeCommand = (cmd: string, cwd: string) => {
  return Effect.tryPromise(
    () =>
      new Promise<string>((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
          if (error) {
            console.log("Error occurred executing command:", error);
            reject(stderr);
          } else {
            resolve(stdout);
          }
        });
      })
  );
};

const echoPastedText = ({ text }: { text: string }) =>
  Effect.gen(function* (_) {
    yield* _(executeCommand(`echo ${text}`, process.cwd()));
  });

const text = Args.text({ name: "text" });
const program = Command.make("Echo pasted string", { text }, echoPastedText);

const cli = Command.run(program, {
  name: "Patchwork CLI",
  version: "v1.0.0",
});

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
