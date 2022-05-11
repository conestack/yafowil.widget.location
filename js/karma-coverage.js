const percentage = {
    lines: 43,
    statements: 43,
    functions: 45,
    branches: 16
}
var summary = require('./karma/coverage/coverage-summary.json');

for (let res in summary.total) {
    if (summary.total[res].pct < percentage[res]) {
        throw new Error(
        `Coverage too low on ${res},
        expected: ${percentage[res]},
        got: ${summary.total[res].pct}`
        );
    }
}