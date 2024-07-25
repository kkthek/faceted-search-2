# faceted-search-2
Next generation of EnhancedRetrieval

# Build

Install NPM - https://nodejs.org/en/download

Change URL of SOLR instance in webpack.config.js (if necessary):

        devServer: {
            port: 9000,
            proxy: [
              {
                context: ['/proxy'],
                target: 'http://localhost/main/mediawiki/rest.php/EnhancedRetrieval/v1',
                changeOrigin: true,
              }
            ]
        }

Open console and change to folder facetedSearch2/fs-react
* npm install       (initially or after dependency update)
* npm start         (to run the webserver for local development)
* npm run dev-build (DEV build)
* npm run build     (PROD build)
* npm test          (to run all tests)
* npm run it-test   (to run all integration-tests)