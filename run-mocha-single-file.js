const Mocha = require("mocha");

const filePathFromArgs = process.argv[2];

let filePathToRun = filePathFromArgs.replace(/\\/g, '/');

const extRegex = /\.tsx?$/;

if (!filePathToRun || !extRegex.test(filePathToRun)) {
    throw new Error(`Can't run file ${filePathFromArgs} with mocha`);

}

filePathToRun = filePathToRun.replace(
    extRegex,
    (match) => match.replace('ts', 'js')
);

filePathToRun = filePathToRun.replace(/^src/, './build-test')

console.log(filePathToRun);

const mocha = new Mocha({

});
mocha.addFile(filePathToRun);

// Run the tests.
mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
});