const { Client } = require('@elastic/elasticsearch');

// Create an Elasticsearch client instance
const esClient = new Client({ node: 'http://localhost:9200' });

// Define the Elasticsearch query
const searchQuery = {
  index: 'categoryname_idx', // Replace 'foo' with your actual index name
  body: {
    query: {
      match_all: {} // Match all documents
    }
  }
};

// Execute the Elasticsearch query
esClient.search(searchQuery)
  .then(response => {
    // Handle the Elasticsearch response
    const hits = response.body.hits.hits;
    hits.forEach(hit => {
      console.log(hit._source); // Output each document
    });
  })
  .catch(error => {
    // Handle errors
    console.error('Error executing Elasticsearch query:', error);
  });
