module.exports = {
    apps: [
        {
            name: "makerhive",
            script: "PORT=3025 node build/index.js"
        },
        {
            name: "makerhivedev",
            script: "cd client/build && PORT=3026 yarn start"
        }
    ]
};
