module.exports = {
    test: /\.(ts|tsx)$/,
    use: [
        {
            loader: "ts-loader",
            options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true
            }
        }
    ]
};
